"use strict";

import {CCommand}                                   from "../../CCommand";
import {CNetworkPacketReader, INetworkPacketReader} from "../../../network/CNetworkPacketReader";
import {CCommandResult, ICommandResult}             from "../../CCommandResult";
import {CNetworkPacketWriter, INetworkPacketWriter} from "../../../network/CNetworkPacketWriter";

export class CGetUserCommand extends CCommand
{
	public async execute(uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const request: INetworkPacketReader.GetUser     = CNetworkPacketReader.requestGetUser(commands);
		const response: INetworkPacketWriter.GetUser    = CNetworkPacketWriter.responseGetUser();

		return CCommandResult.success({"status": true});
	}
}