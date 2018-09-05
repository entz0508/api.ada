"use strict";

import {CJson} from "../utils/CJson";

export namespace INetworkPacketReader
{
	export interface Request
	{
		method: string;
		url: string;
		uuid: number;
		shard: number;

		commands: object;
	}

	export interface Header
	{
		method: string;
		url: string;
		uuid: number;
		shard: number;
	}

	export interface GetUser
	{
	}

	export interface CreateUser
	{
	}
}

export class CNetworkPacketReader
{
	/********************************************************************************************
	 * common
	 ********************************************************************************************/
	public static request(header: INetworkPacketReader.Header, commands: object): INetworkPacketReader.Request
	{
		const results: INetworkPacketReader.Request = {
			method      : CJson.safeStringParse( header, "method"),
			url         : CJson.safeStringParse( header, "url"),
			uuid        : CJson.safeIntegerParse(header, "uuid"),
			shard       : CJson.safeIntegerParse(header, "shard"),
			commands    : commands,
		};

		return results;
	}

	/********************************************************************************************
	 * user
	 ********************************************************************************************/
	public static requestGetUser(request: object): INetworkPacketReader.GetUser
	{
		const results: INetworkPacketReader.GetUser = {

		};

		return results;
	}

	public static requestCreateUser(): INetworkPacketReader.CreateUser
	{
		const results: INetworkPacketReader.CreateUser = {

		};

		return results;
	}

	// ...

}