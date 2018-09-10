"use strict";

import {CNetworkPacketReader, INetworkPacketReader} from "../network/CNetworkPacketReader";
import {CExecuteHandler}                            from "../commands/CExecuteHandler";
import {ICommandResult}                             from "../commands/CHandlerResult";
import {INetworkPacketWriter}                       from "../network/CNetworkPacketWriter";
import {CDebug}                                     from "../utils/CDebug";

class CTCPRoute
{
	public static async packetHandling(argument: any[], callback: Function): Promise<void>
	{
		try {
			const header: INetworkPacketReader.Header       = argument[0];
			const commands: object                          = argument[1];

			const request: INetworkPacketReader.Request     = CNetworkPacketReader.request(header, commands);
			const response: INetworkPacketWriter.Response   = {} as any;

			CDebug.logDebugFormat("------>> Request : %j", request);

			const JSONResult: ICommandResult = await CExecuteHandler.instance(CExecuteHandler).executeCommand(request.url, request.uuid, request.shard, request.commands);

			response.commandStatus  = JSONResult.commandStatus;
			response.commandResult  = JSONResult.commandResult;

			if (JSONResult.failedMessage !== "") {
				response.failedMessage = JSONResult.failedMessage;
			}

			CDebug.logDebugFormat("<<------ Response: %j", response);

			callback(response);
		}
		catch (exception) {
		}
	}
}

export = CTCPRoute;