"use strict";

import {CMemoryPool}     from "../utils/pool/CMemoryPool";
import {IPoolAbleObject} from "../utils/pool/IPoolAbleObject";
import {CNetworkConst}   from "./CNetworkConst";

export class CNetworkResponse implements IPoolAbleObject
{
	protected m_uuid: number                    = -1;

	protected m_token: string                   = "";
	protected m_version: number                 = -1;
	protected m_status: number                  = -1;
	protected m_tokenRegistTime: number         = -1;
	protected m_tokenUpdateTime: number         = -1;
	protected m_tokenExpireTime: number         = -1;
	protected m_results: Object                 = {};

	public init(uuid: number, token: string, version: number, status: number = -1, registTime: number, updateTime: number, expireTime: number): boolean
	{
		this.m_uuid                 = uuid;
		this.m_token                = token;
		this.m_version              = version;
		this.m_status               = status;
		this.m_tokenRegistTime      = registTime;
		this.m_tokenUpdateTime      = updateTime;
		this.m_tokenExpireTime      = expireTime;

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

	public get token(): string
	{
		return this.m_token;
	}

	public set token(m_token: string)
	{
		this.m_token = m_token;
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

	public get tokenRegistTime(): number
	{
		return this.m_tokenRegistTime;
	}

	public set tokenRegistTime(date: number)
	{
		this.m_tokenRegistTime = date;
	}

	public get tokenUpdateTime(): number
	{
		return this.m_tokenUpdateTime;
	}

	public set tokenUpdateTime(date: number)
	{
		this.m_tokenUpdateTime = date;
	}

	public get tokenExpireTime(): number
	{
		return this.m_tokenExpireTime;
	}

	public set tokenExpireTime(date: number)
	{
		this.m_tokenExpireTime = date;
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
			[CNetworkConst.Keys.Token]              : this.m_token,
			[CNetworkConst.Keys.DataVersion]        : this.m_version,
			[CNetworkConst.Keys.Status]             : this.m_status,
			[CNetworkConst.Keys.TokenRegistTime]    : this.m_tokenRegistTime,
			[CNetworkConst.Keys.TokenUpdateTime]    : this.m_tokenUpdateTime,
			[CNetworkConst.Keys.TokenExpireTime]    : this.m_tokenExpireTime,
			[CNetworkConst.Keys.ResponseCommands]   : this.m_results,
		}
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CNetworkResponsePool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_uuid                 = -1;
		this.m_token                = "";
		this.m_version              = -1;
		this.m_status               = -1;
		this.m_tokenRegistTime      = -1;
		this.m_tokenUpdateTime      = -1;
		this.m_tokenExpireTime      = -1;
		this.m_results              = [];
	}
}

export class CNetworkResponsePool
{
	protected static ms_pool: CMemoryPool<CNetworkResponse> = new CMemoryPool<CNetworkResponse>(CNetworkResponse);

	public static alloc(uuid: number = -1, token: string = "", version: number = -1, status: number = -1, registTime: number = -1, updateTime: number = -1, expireTime: number = -1): CNetworkResponse
	{
		const instance: CNetworkResponse = this.ms_pool.alloc();

		if (instance && instance.init(uuid, token, version, status, registTime, updateTime, expireTime)) {
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