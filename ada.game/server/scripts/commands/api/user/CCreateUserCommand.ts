"use strict";

import {CCommand}                                   from "../../CCommand";
import {CNetworkPacketReader, INetworkPacketReader} from "../../../network/CNetworkPacketReader";
import {CCommandResult, ICommandResult}             from "../../CCommandResult";
import {CNetworkPacketWriter, INetworkPacketWriter} from "../../../network/CNetworkPacketWriter";

export class CCreateUserCommand extends CCommand
{
	public async execute(uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const request: INetworkPacketReader.CreateUser  = CNetworkPacketReader.requestGetUser(commands);
		const response: INetworkPacketWriter.CreateUser = CNetworkPacketWriter.responseGetUser();

		return CCommandResult.success(response);
	}
}