"use strict";

import * as redis      from "redis";
import {IModel}        from "../IModel";
import {CJson}         from "../../utils/CJson";
import {CRedisConnect} from "../../utils/database/redis/CRedisConnect";
import {CTime}         from "../../utils/time/CTime";
import {CNetworkConst} from "../../network/CNetworkConst";

const sha1 = require("sha1");

export class CSessionModel implements IModel
{
	protected m_uuid: number            = -1;
	protected m_dbShard: string         = "";
	protected m_session: string         = "";
	protected m_registTime: number      = -1;
	protected m_updateTime: number      = -1;
	protected m_expireTime: number      = -1;

	protected static m_connect: redis.RedisClient           = CRedisConnect.instance(CRedisConnect).connection();
	protected static m_sessionSlat: string                  = "aabcx0";
	protected static m_sessionExpireIntervalSeconds: number = 3000;

	public get uuid(): number
	{
		return this.m_uuid;
	}

	public get dbShard(): string
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

	public json(): Object
	{
		return {
			[CNetworkConst.Keys.UUID]        : this.uuid,
			[CNetworkConst.Keys.Session]     : this.session,
			[CNetworkConst.Keys.RegistTime]  : this.registTime,
			[CNetworkConst.Keys.UpdateTime]  : this.updateTime,
			[CNetworkConst.Keys.ExpireTime]  : this.expireTime,
		};
	}

	public mapping(data: Object): void
	{
		this.m_uuid         = CJson.safeIntegerParse(data, CNetworkConst.Keys.UUID, -1, false);
		this.m_dbShard      = CJson.safeStringParse( data, CNetworkConst.Keys.DBShard, "", false);
		this.m_session      = CJson.safeStringParse( data, CNetworkConst.Keys.Session, "", false);
		this.m_registTime   = CJson.safeIntegerParse(data, CNetworkConst.Keys.RegistTime, -1, false);
		this.m_updateTime   = CJson.safeIntegerParse(data, CNetworkConst.Keys.UpdateTime, -1, false);
		this.m_expireTime   = CJson.safeIntegerParse(data, CNetworkConst.Keys.ExpireTime, -1, false);
	}

	public init(): boolean
	{
		return true;
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

	public static async getSession(session: string, isTTLUpdate: boolean = true): Promise<CSessionModel>
	{
		const datenow: number           = CTime.Util.getServerTimeStamp();
		const sessionHashKey: string    = CSessionModel.getSessionHashKey(session);
		const sessionData: any          = await this.m_connect.hgetallAsync(sessionHashKey);
		if (sessionData === null) {
			return null;
		}

		const CSession: CSessionModel = new CSessionModel();
		CSession.mapping(sessionData);

		if (isTTLUpdate) {
			const updateData: Object = {
				[CNetworkConst.Keys.UpdateTime]: datenow,
				[CNetworkConst.Keys.ExpireTime]: datenow + this.m_sessionExpireIntervalSeconds * 1000
			};

			await this.m_connect.hmsetAsync(sessionHashKey, updateData);
			await this.m_connect.expireAsync(sessionHashKey, this.m_sessionExpireIntervalSeconds);
			await this.m_connect.setexAsync(this.getSessionIndexKey(CSession.uuid), this.m_sessionExpireIntervalSeconds, session);
		}

		return CSession;
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async insertSession(uuid: number): Promise<CSessionModel>
	{
		const datenow: number = CTime.Util.getServerTimeStamp();

		await this.deleteSessionByUuid(uuid);

		const sessionGenerate: string       = Math.floor(Math.random()) + datenow + this.m_sessionSlat;
		const session: string               = sha1(sessionGenerate, {});
		const sessionHashKey: string        = this.getSessionHashKey(session);
		const sessionIndexKey: string       = this.getSessionIndexKey(uuid);

		const sessionData: Object = {
			[CNetworkConst.Keys.UUID]: uuid,
			[CNetworkConst.Keys.SessionRegistTime]: datenow,
			[CNetworkConst.Keys.SessionUpdateTime]: datenow,
			[CNetworkConst.Keys.SessionExpireTime]: datenow + this.m_sessionExpireIntervalSeconds * 1000,
		};

		if (await this.m_connect.existsAsync(sessionHashKey)) {
			return null;
		}

		// Session 정보 저장.
		await this.m_connect.hmsetAsync(sessionHashKey, sessionData);
		// Session 만료시간 설정.
		await this.m_connect.expireAsync(sessionHashKey, this.m_sessionExpireIntervalSeconds);
		// Session index 생성. (UUID 기준)
		await this.m_connect.setexAsync(sessionIndexKey, this.m_sessionExpireIntervalSeconds, session);

		const instance: CSessionModel = new CSessionModel();
		instance.mapping(sessionData);

		return instance;
	}

	/********************************************************************************************
	 * query.delete
	 ********************************************************************************************/
	protected static async deleteSessionByUuid(uuid: number): Promise<void>
	{
		const sessionStr: string = await this.getSessionString(uuid);
		if (sessionStr !== null) {
			await this.m_connect.delAsync(this.getSessionHashKey(sessionStr));
		}

		await this.m_connect.delAsync(this.getSessionIndexKey(uuid));
	}
}