"use strict";

export namespace INetworkPacketReader
{
	export interface Request
	{
		token?: string;
		version: number;
		requestCommand: Object;
	}

	export interface PacketExecuteResults
	{
		commandStatus: number;
		commandResult: Object;
	}
}

export class CNetworkPacketReader
{

}