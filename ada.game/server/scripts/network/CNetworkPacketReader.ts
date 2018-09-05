"use strict";

import {CJson}         from "../utils/CJson";
import {CNetworkConst} from "./CNetworkConst";

export namespace INetworkPacketReader
{
	export interface Request
	{
		session: string;
		dataVersion: number;
		packetSequenceNo: number;
		requestCommands: RequestCommand[];
	}

	export interface RequestCommand
	{
		commandSequenceNo: number;
		packetId: number;
		parameters: Object;
	}

	export interface GetUser
	{

	}

	export interface CreateUser
	{

	}

	// ...

}

export class CNetworkPacketReader
{
	/********************************************************************************************
	 * common
	 ********************************************************************************************/
	public static request(request: Object): INetworkPacketReader.Request
	{
		const results: INetworkPacketReader.Request = {
			session             : CJson.safeStringParse( request, CNetworkConst.Keys.Session),
			dataVersion         : CJson.safeIntegerParse(request, CNetworkConst.Keys.DataVersion),
			packetSequenceNo    : CJson.safeIntegerParse(request, CNetworkConst.Keys.PacketSequenceNo),
			requestCommands     : CJson.safeArrayParse(  request, CNetworkConst.Keys.RequestCommands)
		};

		return results;
	}

	/********************************************************************************************
	 * user
	 ********************************************************************************************/
	public static requestGetUser(request: Object): INetworkPacketReader.GetUser
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