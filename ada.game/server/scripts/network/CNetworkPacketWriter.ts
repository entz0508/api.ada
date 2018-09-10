"use strict";

export namespace INetworkPacketWriter
{
	export interface Response
	{
		commandStatus: number;
		commandResult: Object;
		failedMessage?: string;
	}

	export interface GetUser
	{

	}

	export interface CreateUser
	{

	}
}

export class CNetworkPacketWriter
{
	public static responseGetUser(): INetworkPacketWriter.GetUser
	{
		const results: INetworkPacketWriter.GetUser = {};
		return results;
	}

	public static responseCreateUser(): INetworkPacketWriter.CreateUser
	{
		const results: INetworkPacketWriter.CreateUser = {};
		return results;
	}
}