"use strict";

import {CMemoryPool}     from "../utils/pool/CMemoryPool";
import {IPoolAbleObject} from "../utils/pool/IPoolAbleObject";
import {CNetworkConst}   from "./CNetworkConst";

export class CNetworkResponse implements IPoolAbleObject
{
	protected m_uuid: number                    = -1;

	protected m_session: string                 = "";
	protected m_version: number                 = -1;
	protected m_status: number                  = -1;
	protected m_sessionRegistTime: number       = -1;
	protected m_sessionUpdateTime: number       = -1;
	protected m_sessionExpireTime: number       = -1;
	protected m_results: Object                 = {};

	public init(uuid: number, session: string, version: number, status: number = -1, registTime: number, updateTime: number, expireTime: number): boolean
	{
		this.m_uuid                 = uuid;
		this.m_session              = session;
		this.m_version              = version;
		this.m_status               = status;
		this.m_sessionRegistTime    = registTime;
		this.m_sessionUpdateTime    = updateTime;
		this.m_sessionExpireTime    = expireTime;

		return true;
	}

	public get uuid(): number
	{
		return this.m_uuid;
	}

	public set uuid(uuid: number)
	{
		this.m_uuid = uuid;
	}

	public get session(): string
	{
		return this.m_session;
	}

	public set session(session: string)
	{
		this.m_session = session;
	}

	public get version(): number
	{
		return this.m_version;
	}

	public set version(version: number)
	{
		this.m_version = version;
	}

	public get status(): number
	{
		return this.m_status;
	}

	public set status(status: number)
	{
		this.m_status = status;
	}

	public get sessionRegistTime(): number
	{
		return this.m_sessionRegistTime;
	}

	public set sessionRegistTime(date: number)
	{
		this.m_sessionRegistTime = date;
	}

	public get sessionUpdateTime(): number
	{
		return this.m_sessionUpdateTime;
	}

	public set sessionUpdateTime(date: number)
	{
		this.m_sessionUpdateTime = date;
	}

	public get sessionExpireTime(): number
	{
		return this.m_sessionExpireTime;
	}

	public set sessionExpireTime(date: number)
	{
		this.m_sessionExpireTime = date;
	}

	public get results(): Object
	{
		return this.m_results;
	}

	public set results(results: Object)
	{
		this.m_results = results;
	}

	public json(): Object
	{
		return {
			[CNetworkConst.Keys.DataVersion]        : this.m_version,
			[CNetworkConst.Keys.Status]             : this.m_status,
			[CNetworkConst.Keys.SessionRegistTime]  : this.m_sessionRegistTime,
			[CNetworkConst.Keys.SessionUpdateTime]  : this.m_sessionUpdateTime,
			[CNetworkConst.Keys.SessionExpireTime]  : this.m_sessionExpireTime,
			[CNetworkConst.Keys.ResponseCommands]   : this.m_results,
		}
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CNetworkResponsePacketPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_uuid                 = -1;
		this.m_session              = "";
		this.m_version              = -1;
		this.m_status               = -1;
		this.m_sessionRegistTime    = -1;
		this.m_sessionUpdateTime    = -1;
		this.m_sessionExpireTime    = -1;
		this.m_results              = [];
	}
}

export class CNetworkResponsePacketPool
{
	protected static ms_pool: CMemoryPool<CNetworkResponse> = new CMemoryPool<CNetworkResponse>(CNetworkResponse);

	public static alloc(uuid: number = -1, session: string = "", version: number = -1, status: number = -1, registTime: number = -1, updateTime: number = -1, expireTime: number = -1): CNetworkResponse
	{
		const instance: CNetworkResponse = this.ms_pool.alloc();

		if (instance && instance.init(uuid, session, version, status, registTime, updateTime, expireTime)) {
			return instance;
		}

		return null;
	}

	public static free(instance: CNetworkResponse): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}