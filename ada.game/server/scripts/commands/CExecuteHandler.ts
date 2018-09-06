"use strict";

import {CSingleton}                     from "../utils/CSingleton";
import {CNetworkConst}                  from "../network/CNetworkConst";
import {CHandlerResult, ICommandResult} from "./CHandlerResult";
import {CUserHandler}                   from "./api/CUseHandler";

export class CExecuteHandler extends CSingleton
{
	protected m_handler: Map<string, Function> = new Map<string, Function>();

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	protected onInstantiate(): void
	{
		this.m_handler.set(CNetworkConst.PacketId.GetUser,         CUserHandler.getUser);
		this.m_handler.set(CNetworkConst.PacketId.CreateUser,      CUserHandler.createUser);

		// ...
	}

	protected onDestroyInstance(): void
	{
		this.m_handler = new Map<string, any>();
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public async executeCommand(packetName: string, uuid: number, shard: number, commands: object): Promise<ICommandResult>
	{
		const command: Function = this.getCommand(packetName);

		if (command === null) {
			return CHandlerResult.failed(CNetworkConst.CommandStatus.UnknownCommand, `Unknown packet name. ${packetName}`);
		}

		const response: ICommandResult = await command(uuid, shard, commands);

		return response;
	}

	protected getCommand(packetName: string): Function
	{
		const instance: Function = this.m_handler.get(packetName);

		if (! instance) {
			return null;
		}

		return instance;
	}
}