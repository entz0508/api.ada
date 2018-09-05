"use strict";

import * as redis        from "redis";
import {CJson}           from "../CJson";
import {CRedisConnect}   from "../database/redis/CRedisConnect";
import {CTime}           from "../time/CTime";
import {CConfig}         from "../../config/CConfig";
import {IPoolAbleObject} from "../pool/IPoolAbleObject";
import {CMemoryPool}     from "../pool/CMemoryPool";

const sha1 = require("sha1");

export class CRedisSession implements IPoolAbleObject
{
	protected m_uuid: number            = -1;
	protected m_dbShard: number         = -1;
	protected m_session: string         = "";
	protected m_registTime: number      = -1;
	protected m_updateTime: number      = -1;
	protected m_expireTime: number      = -1;

	protected static m_connect: redis.RedisClient   = CRedisConnect.instance(CRedisConnect).connection();
	protected static m_sessionSlat: string          = "aabcx0";

	public init(): boolean
	{
		return true;
	}

	public get uuid(): number
	{
		return this.m_uuid;
	}

	public get dbShard(): number
	{
		return this.m_dbShard;
	}

	public get session(): string
	{
		return this.m_session;
	}

	public get registTime(): number
	{
		return this.m_registTime;
	}

	public get updateTime(): number
	{
		return this.m_updateTime;
	}

	public get expireTime(): number
	{
		return this.m_expireTime;
	}

	public mapping(data: Object): void
	{
		this.m_uuid         = CJson.safeIntegerParse(data, "uuid", -1, false);
		this.m_dbShard      = CJson.safeIntegerParse(data, "dbShard", -1, false);
		this.m_session      = CJson.safeStringParse( data, "session", "", false);
		this.m_registTime   = CJson.safeIntegerParse(data, "registTime", -1, false);
		this.m_updateTime   = CJson.safeIntegerParse(data, "updateTime", -1, false);
		this.m_expireTime   = CJson.safeIntegerParse(data, "expireTime", -1, false);
	}

	/********************************************************************************************
	 * parse key
	 ********************************************************************************************/
	protected static getSessionIndexKey(uuid: number): string
	{
		return "{UUID:" + uuid + "}:SESSION"
	}

	protected static getSessionHashKey(session): string
	{
		return "{SESSION:" + session + "}";
	}

	/********************************************************************************************
	 * query.select
	 ********************************************************************************************/
	protected static async getSessionString(uuid: number): Promise<string>
	{
		const session: string = await this.m_connect.getAsync(this.getSessionIndexKey(uuid));
		if (! session) {
			return null;
		}
		return session;
	}

	public static async getSession(session: string, isTTLUpdate: boolean = true): Promise<CRedisSession>
	{
		const datenow: number           = CTime.Util.getServerTimeStamp();
		const sessionHashKey: string    = this.getSessionHashKey(session);
		const sessionData: any          = await this.m_connect.hgetallAsync(sessionHashKey);
		if (sessionData === null) {
			return null;
		}

		const CRedisSession: CRedisSession = CRedisSessionPool.alloc();
		CRedisSession.mapping(sessionData);

		if (isTTLUpdate) {
			const updateData: Object = {
				"updateTime": datenow,
				"expireTime": datenow + CConfig.Env.SessionExpireSeconds * 1000
			};

			await this.m_connect.hmsetAsync(sessionHashKey, updateData);
			await this.m_connect.expireAsync(sessionHashKey, CConfig.Env.SessionExpireSeconds);
			await this.m_connect.setexAsync(this.getSessionIndexKey(CRedisSession.uuid), CConfig.Env.SessionExpireSeconds, session);
		}

		return CRedisSession;
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async addSession(uuid: number, dbShard: number = -1): Promise<CRedisSession>
	{
		const datenow: number = CTime.Util.getServerTimeStamp();

		await this.deleteSessionBy(uuid);

		const sessionGenerate: string       = Math.floor(Math.random()) + datenow + this.m_sessionSlat;
		const session: string               = sha1(sessionGenerate, {});
		const sessionHashKey: string        = this.getSessionHashKey(session);
		const sessionIndexKey: string       = this.getSessionIndexKey(uuid);

		const sessionData: Object = {
			"uuid"          : uuid,
			"dbShard"       : dbShard,
			"registTime"    : datenow,
			"updateTime"    : datenow,
			"expireTime"    : datenow + CConfig.Env.SessionExpireSeconds * 1000,
		};

		if (await this.m_connect.existsAsync(sessionHashKey)) {
			return null;
		}

		// Session 정보 저장.
		await this.m_connect.hmsetAsync(sessionHashKey, sessionData);
		// Session 만료시간 설정.
		await this.m_connect.expireAsync(sessionHashKey, CConfig.Env.SessionExpireSeconds);
		// Session index 생성. (UUID 기준)
		await this.m_connect.setexAsync(sessionIndexKey, CConfig.Env.SessionExpireSeconds, session);

		const instance: CRedisSession = CRedisSessionPool.alloc();
		instance.mapping(sessionData);

		return instance;
	}

	/********************************************************************************************
	 * query.delete
	 ********************************************************************************************/
	protected static async deleteSessionBy(uuid: number): Promise<void>
	{
		const sessionStr: string = await this.getSessionString(uuid);
		if (sessionStr !== null) {
			await this.m_connect.delAsync(this.getSessionHashKey(sessionStr));
		}

		await this.m_connect.delAsync(this.getSessionIndexKey(uuid));
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CRedisSessionPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_uuid            = -1;
		this.m_dbShard         = -1;
		this.m_session         = "";
		this.m_registTime      = -1;
		this.m_updateTime      = -1;
		this.m_expireTime      = -1;
	}
}

export class CRedisSessionPool
{
	protected static ms_pool: CMemoryPool<CRedisSession> = new CMemoryPool<CRedisSession>(CRedisSession);

	public static alloc(): CRedisSession
	{
		const instance: CRedisSession = this.ms_pool.alloc();

		if (instance && instance.init()) {
			return instance;
		}

		return null;
	}

	public static free(instance: CRedisSession): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}