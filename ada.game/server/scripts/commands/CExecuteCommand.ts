"use strict";

import {CNetworkConst}                  from "../network/CNetworkConst";
import {CGetUserCommand}                from "./api/user/CGetUserCommand";
import {CCommand}                       from "./CCommand";
import {CSingleton}                     from "../utils/CSingleton";
import {CCommandResult, ICommandResult} from "./CCommandResult";
import {CCreateUserCommand}             from "./api/user/CCreateUserCommand";

export class CExecuteCommand extends CSingleton
{
	protected m_commands: Map<string, CCommand> = new Map<string, CCommand>();

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
		this.m_commands = new Map<string, any>();
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public async executeCommand(packetName: string, uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const command: CCommand = this.getCommand(packetName);

		if (command === null) {
			return CCommandResult.failed(CNetworkConst.CommandStatus.UnknownCommand, `Unknown packet name. ${packetName}`);
		}

		const response: ICommandResult = await command.execute(uuid, shard, commands);

		return response;
	}

	protected getCommand(packetName: string): CCommand
	{
		const instance: CCommand = this.m_commands.get(packetName);

		if (! instance) {
			return null;
		}

		return instance;
	}
}