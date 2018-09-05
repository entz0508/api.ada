"use strict";

import {CNetworkPacketReader, INetworkPacketReader} from "../network/CNetworkPacketReader";
import {CExecuteCommand}                            from "../commands/CExecuteCommand";
import {ICommandResult}                             from "../commands/CCommandResult";
import {CNetworkConst}                              from "../network/CNetworkConst";
import {INetworkPacketWriter}                       from "../network/CNetworkPacketWriter";
import {CDebug}                                     from "../utils/CDebug";

class CTCPRoute
{
	public static async packetHandling(argument: any[], callback: Function): Promise<void>
	{
		const options: INetworkPacketReader.Header      = argument[0];
		const commands: object                          = argument[1];

		const request: INetworkPacketReader.Request     = CNetworkPacketReader.request(options, commands);
		const response: INetworkPacketWriter.Response   = {} as any;

		CDebug.logDebugFormat("------>> Request : %j", request);

		const JSONResult: ICommandResult = await CExecuteCommand.instance(CExecuteCommand).executeCommand(request.url, request.uuid, request.shard, request.commands);

		response[CNetworkConst.Keys.CommandStatus] = JSONResult[CNetworkConst.Keys.CommandStatus];
		response[CNetworkConst.Keys.ResultData]    = JSONResult[CNetworkConst.Keys.ResultData];

		if (JSONResult.failedMessage !== "") {
			response[CNetworkConst.Keys.FailedMessage] = JSONResult.failedMessage;
		}

		CDebug.logDebugFormat("<<------ Response: %j", response);

		callback(response);
	}
}

export = CTCPRoute;