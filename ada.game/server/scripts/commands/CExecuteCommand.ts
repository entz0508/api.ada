"use strict";

import {CNetworkConst}                  from "../network/CNetworkConst";
import {CGetUserCommand}                from "./api/user/CGetUserCommand";
import {CCommand}                       from "./CCommand";
import {CSessionModel}                  from "../models/session/CSessionModel";
import {CSingleton}                     from "../utils/CSingleton";
import {CCommandResult, ICommandResult} from "./CCommandResult";
import {CCreateUserCommand}             from "./api/user/CCreateUserCommand";

export class CExecuteCommand extends CSingleton
{
	protected m_commands: Map<number, CCommand> = new Map<number, CCommand>();

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	protected onInstantiate(): void
	{
		this.m_commands.set(CNetworkConst.PacketId.GetUser,         new CGetUserCommand);
		this.m_commands.set(CNetworkConst.PacketId.CreateUser,      new CCreateUserCommand);

		// command 추가시 아래에 기입.

	}

	protected onDestroyInstance(): void
	{
		this.m_commands = new Map<number, any>();
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public async executeCommand(uuid: number, dbShard: string, packetId: number, session: CSessionModel, params: Object): Promise<ICommandResult>
	{
		const command: CCommand = this.getCommand(packetId);

		if (command === null) {
			return CCommandResult.failed(CNetworkConst.CommandStatus.UnknownCommand, "Unknown packet id");
		}

		const response: ICommandResult = await command.execute(uuid, dbShard, session, params);

		return response;
	}

	protected getCommand(packetId: number): CCommand
	{
		const instance: CCommand = this.m_commands.get(packetId);

		if (! instance) {
			return null;
		}

		return instance;
	}
}