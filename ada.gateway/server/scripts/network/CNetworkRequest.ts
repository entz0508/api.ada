"use strict";

import {IPoolAbleObject} from "../utils/pool/IPoolAbleObject";
import {CMemoryPool}     from "../utils/pool/CMemoryPool";
import {CJson}           from "../utils/CJson";
import {CNetworkConst}   from "./CNetworkConst";

export class CNetworkRequest implements IPoolAbleObject
{
	protected m_token?: string      = "";
	protected m_version: number     = -1;
	protected m_commands: object    = {};

	public init(body: Object): boolean
	{
		this.m_token        = CJson.safeStringParse( body, CNetworkConst.Keys.Token, "", false);
		this.m_version      = CJson.safeIntegerParse(body, CNetworkConst.Keys.DataVersion);
		this.m_commands     = CJson.safeObjectParse( body, CNetworkConst.Keys.Commands);

		return true;
	}

	public get token(): string
	{
		return this.m_token;
	}

	public get version(): number
	{
		return this.m_version;
	}

	public get commands(): object
	{
		return this.m_commands;
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CNetworkRequestPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_token      = "";
		this.m_version      = -1;
		this.m_commands     = {};
	}
}

export class CNetworkRequestPool
{
	protected static ms_pool: CMemoryPool<CNetworkRequest> = new CMemoryPool<CNetworkRequest>(CNetworkRequest);

	public static alloc(body: Object = {}): CNetworkRequest
	{
		const instance: CNetworkRequest = this.ms_pool.alloc();

		if (instance && instance.init(body)) {
			return instance;
		}

		return null;
	}

	public static free(instance: CNetworkRequest): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}