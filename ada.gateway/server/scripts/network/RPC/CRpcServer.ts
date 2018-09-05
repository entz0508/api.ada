"use strict";

import {CSingleton} from "../../utils/CSingleton";

const RPCServer = require("jsonrpc-node").TCP.Server;

export class CRpcServer extends CSingleton
{
	protected m_socket: Object = {};

	/********************************************************************************************
	 * abstract
	 ********************************************************************************************/
	protected onInstantiate(): void
	{

	};

	protected onDestroyInstance(): void
	{
		this.m_socket = {};
	};

	/********************************************************************************************
	 * RPC server socket
	 ********************************************************************************************/
	public async connect(name: string, port: number): Promise<void>
	{
		if (this.m_socket[name] === undefined) {
			this.m_socket[name] = new RPCServer();

			this.m_socket[name].register("packet", this.packetHandling);

			await this.m_socket[name].listen(port, () => {
				console.log(`[${name.toUpperCase()}] Socket server listening on port(${port})`);
			});
		}
	}

	protected async packetHandling(argument: object[], callback): Promise<void>
	{
		const options: object   = argument[0];
		const commands: object  = argument[1];
		callback(commands);
	}
}