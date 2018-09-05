"use strict";

import {CMemoryPool}          from "../utils/pool/CMemoryPool";
import {IPoolAbleObject}      from "../utils/pool/IPoolAbleObject";
import {CJson}                from "../utils/CJson";
import {CNetworkConst}        from "./CNetworkConst";
import {CSessionModel}        from "../models/session/CSessionModel";
import {INetworkPacketWriter} from "./CNetworkPacketWriter";

export class CNetworkResponse implements IPoolAbleObject
{
	protected m_session: string                                             = "";
	protected m_uuid: number                                                = -1;
	protected m_dataVersion: number                                         = -1;
	protected m_packetSequenceNo: number                                    = -1;
	protected m_packetStatus: number                                        = 0;
	protected m_sessionRegistTime: number                                   = -1;
	protected m_sessionUpdateTime: number                                   = -1;
	protected m_sessionExpireTime: number                                   = -1;
	protected m_responseCommands: INetworkPacketWriter.ResponseCommand[]    = [];

	public init(session: string, uuid: number, dataVersion: number, packetSequenceNo: number, registTime: number, updateTime: number, expireTime: number): boolean
	{
		this.m_session              = session;
		this.m_uuid                 = uuid;
		this.m_dataVersion          = dataVersion;
		this.m_packetSequenceNo     = packetSequenceNo;
		this.m_sessionRegistTime    = registTime;
		this.m_sessionUpdateTime    = updateTime;
		this.m_sessionExpireTime    = expireTime;

		return true;
	}

	public get session(): string
	{
		return this.m_session;
	}

	public get uuid(): number
	{
		return this.m_uuid;
	}

	public get dataVersion(): number
	{
		return this.m_dataVersion;
	}

	public get packetSequenceNo(): number
	{
		return this.m_packetSequenceNo;
	}

	public get packetStatus(): number
	{
		return this.m_packetStatus;
	}

	public set packetStatus(status: number)
	{
		this.m_packetStatus = status;
	}

	public get sessionRegistTime(): number
	{
		return this.m_sessionRegistTime;
	}

	public get sessionUpdateTime(): number
	{
		return this.m_sessionUpdateTime;
	}

	public get sessionExpireTime(): number
	{
		return this.m_sessionExpireTime;
	}

	public get responseCommands(): INetworkPacketWriter.ResponseCommand[]
	{
		return this.m_responseCommands;
	}

	public setResponseCommand(command: INetworkPacketWriter.ResponseCommand): void
	{
		this.m_responseCommands.push(command);
	}

	public mapping(session: CSessionModel, dataVersion: number, packetSequenceNo: number): void
	{
		this.m_session              = CJson.safeStringParse( session, CNetworkConst.Keys.Session);
		this.m_uuid                 = CJson.safeIntegerParse(session, CNetworkConst.Keys.UUID);
		this.m_dataVersion          = dataVersion;
		this.m_packetSequenceNo     = packetSequenceNo;
		this.m_packetStatus         = 0;
		this.m_sessionRegistTime    = CJson.safeIntegerParse(session, CNetworkConst.Keys.SessionRegistTime);
		this.m_sessionUpdateTime    = CJson.safeIntegerParse(session, CNetworkConst.Keys.SessionUpdateTime);
		this.m_sessionExpireTime    = CJson.safeIntegerParse(session, CNetworkConst.Keys.SessionExpireTime);
		this.m_responseCommands     = [];
	}

	public json(): Object
	{
		return {
			[CNetworkConst.Keys.Session]            : this.m_session,
			[CNetworkConst.Keys.DataVersion]        : this.m_dataVersion,
			[CNetworkConst.Keys.PacketSequenceNo]   : this.m_packetSequenceNo,
			[CNetworkConst.Keys.PacketStatus]       : this.m_packetStatus,
			[CNetworkConst.Keys.SessionRegistTime]  : this.m_sessionRegistTime,
			[CNetworkConst.Keys.SessionUpdateTime]  : this.m_sessionUpdateTime,
			[CNetworkConst.Keys.SessionExpireTime]  : this.m_sessionExpireTime,
			[CNetworkConst.Keys.ResponseCommands]   : this.m_responseCommands,
		}
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CResponsePacketPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_session              = "";
		this.m_uuid                 = -1;
		this.m_dataVersion          = -1;
		this.m_packetSequenceNo     = -1;
		this.m_packetStatus         = -1;
		this.m_sessionRegistTime    = -1;
		this.m_sessionUpdateTime    = -1;
		this.m_sessionExpireTime    = -1;
		this.m_responseCommands     = [];
	}
}

export class CResponsePacketPool
{
	protected static ms_pool: CMemoryPool<CNetworkResponse> = new CMemoryPool<CNetworkResponse>(CNetworkResponse);

	public static alloc(session: string, uuid: number, dataVersion: number, packetSequenceNo: number, registTime: number, updateTime: number, expireTime: number): CNetworkResponse
	{
		const instance: CNetworkResponse = this.ms_pool.alloc();

		if (instance && instance.init(session, uuid, dataVersion, packetSequenceNo, registTime, updateTime, expireTime)) {
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