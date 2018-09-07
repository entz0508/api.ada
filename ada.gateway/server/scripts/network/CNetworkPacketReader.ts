"use strict";

export namespace INetworkPacketReader
{
	export interface Request
	{
		token?: string;
		version: number;
		commands: object;
	}
}

export class CNetworkPacketReader
{

}