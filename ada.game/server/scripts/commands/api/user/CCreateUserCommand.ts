"use strict";

import {CCommand}                                   from "../../CCommand";
import {CSessionModel}                              from "../../../models/session/CSessionModel";
import {CNetworkPacketReader, INetworkPacketReader} from "../../../network/CNetworkPacketReader";
import {CCommandResult, ICommandResult}             from "../../CCommandResult";
import {CNetworkPacketWriter, INetworkPacketWriter} from "../../../network/CNetworkPacketWriter";

export class CCreateUserCommand extends CCommand
{
	public async execute(uuid: number, dbShard: string, session: CSessionModel, params: Object): Promise<ICommandResult>
	{
		const request: INetworkPacketReader.CreateUser = CNetworkPacketReader.requestGetUser(params);

		const response: INetworkPacketWriter.CreateUser = CNetworkPacketWriter.responseGetUser();

		return CCommandResult.success(response);
	}
}