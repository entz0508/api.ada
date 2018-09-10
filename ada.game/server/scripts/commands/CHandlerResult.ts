"use strict";

import {CNetworkConst}  from "../network/CNetworkConst";

export interface ICommandResult
{
	commandStatus: number;
	commandResult: Object;
	failedMessage: string;
}

export class CHandlerResult
{
	protected static commandResults(commandStatus: number = -1, resultData: Object = null, failedMessage: string = ""): ICommandResult
	{
		const commandResult: ICommandResult = {} as any;

		commandResult.commandStatus = commandStatus;
		commandResult.commandResult = resultData;
		commandResult.failedMessage = failedMessage;

		return commandResult;
	}

	public static success(response: Object): ICommandResult
	{
		return this.commandResults(CNetworkConst.CommandStatus.Complete, response);
	}

	public static failed(commandStatus: number, failedMessage: string): ICommandResult
	{
		return this.commandResults(commandStatus, null, failedMessage);
	}
}