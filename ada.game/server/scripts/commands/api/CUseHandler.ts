"use strict";

import {CHandlerResult, ICommandResult}             from "../CHandlerResult";
import {CNetworkPacketReader, INetworkPacketReader} from "../../network/CNetworkPacketReader";
import {CNetworkPacketWriter, INetworkPacketWriter} from "../../network/CNetworkPacketWriter";

export class CUserHandler
{
	/** http://xxx/game/user */
	public static async getUser(uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const request: INetworkPacketReader.GetUser     = CNetworkPacketReader.requestGetUser(commands);

		const response: INetworkPacketWriter.GetUser    = CNetworkPacketWriter.responseGetUser();

		return CHandlerResult.success({"status": true});
	}

	/** http://xxx/game/user/create */
	public static async createUser(uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const request: INetworkPacketReader.CreateUser  = CNetworkPacketReader.requestGetUser(commands);

		const response: INetworkPacketWriter.CreateUser = CNetworkPacketWriter.responseGetUser();

		return CHandlerResult.success(response);
	}
}