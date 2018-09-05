"use strict";

import {IPoolAbleObject}                            from "../utils/pool/IPoolAbleObject";
import {CMemoryPool}                                from "../utils/pool/CMemoryPool";
import {CNetworkPacketReader, INetworkPacketReader} from "./CNetworkPacketReader";

export class CNetworkRequest implements IPoolAbleObject
{
	protected m_session: string     = "";
	protected m_version: number     = -1;
	protected m_commands: object    = {};

	public init(body: Object): boolean
	{
		const request: INetworkPacketReader.Request = CNetworkPacketReader.Request(body);

		this.m_session      = request.session;
		this.m_version      = request.version;
		this.m_commands     = request.commands;

		return true;
	}

	public get session(): string
	{
		return this.m_session;
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
		CNetworkRequestPacketPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_session      = "";
		this.m_version      = -1;
		this.m_commands     = {};
	}
}

export class CNetworkRequestPacketPool
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