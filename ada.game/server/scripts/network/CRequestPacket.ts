"use strict";

import {CJson}                from "../utils/CJson";
import {CNetworkConst}        from "./CNetworkConst";
import {IPoolAbleObject}      from "../utils/pool/IPoolAbleObject";
import {CMemoryPool}          from "../utils/pool/CMemoryPool";
import {INetworkPacketReader} from "./CNetworkPacketReader";

export class CRequestPacket implements IPoolAbleObject
{
	protected m_session: string                                         = "";
	protected m_dataVersion: number                                     = -1;
	protected m_packetSequenceNo: number                                = -1;
	protected m_requestCommands: INetworkPacketReader.RequestCommand[]  = [];

	public init(session: string, dataVersion: number, packetSequenceNo: number, requestCommands: INetworkPacketReader.RequestCommand[]): boolean
	{
		this.m_session          = session;
		this.m_dataVersion      = dataVersion;
		this.m_packetSequenceNo = packetSequenceNo;
		this.m_requestCommands  = requestCommands;

		return true;
	}

	public get session(): string
	{
		return this.m_session;
	}

	public get dataVersion(): number
	{
		return this.m_dataVersion;
	}

	public get packetSequenceNo(): number
	{
		return this.m_packetSequenceNo;
	}

	public get requestCommands(): INetworkPacketReader.RequestCommand[]
	{
		return this.m_requestCommands;
	}

	public mapping(request: INetworkPacketReader.Request): void
	{
		this.m_session          = CJson.safeStringParse( request, CNetworkConst.Keys.Session);
		this.m_dataVersion      = CJson.safeIntegerParse(request, CNetworkConst.Keys.DataVersion);
		this.m_packetSequenceNo = CJson.safeIntegerParse(request, CNetworkConst.Keys.PacketSequenceNo);
		this.m_requestCommands  = CJson.safeArrayParse(  request, CNetworkConst.Keys.RequestCommands);
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CRequestPacketPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_session          = "";
		this.m_dataVersion      = -1;
		this.m_packetSequenceNo = -1;
		this.m_requestCommands  = [];
	}
}

export class CRequestPacketPool
{
	protected static ms_pool: CMemoryPool<CRequestPacket> = new CMemoryPool<CRequestPacket>(CRequestPacket);

	public static alloc(session: string, dataVersion: number, packetSequenceNo: number, requestCommands: INetworkPacketReader.RequestCommand[]): CRequestPacket
	{
		const instance: CRequestPacket = this.ms_pool.alloc();

		if (instance && instance.init(session, dataVersion, packetSequenceNo, requestCommands)) {
			return instance;
		}

		return null;
	}

	public static free(instance: CRequestPacket): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}