"use strict";

export namespace INetworkPacketWriter
{
	export interface Response
	{
		session: string;
		packetSequenceNo: number;
		packetStatus: number;
		sessionRegistTime: number;
		sessionUpdateTime: number;
		sessionExpireTime: number;
		responseCommands: ResponseCommand[];
	}

	export interface ResponseCommand
	{
		commandSequenceNo: number;
		packetId: number;
		commandStatus: number;
		resultData: Object;
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