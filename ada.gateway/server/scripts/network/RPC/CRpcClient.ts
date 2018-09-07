"use strict";

import {CSingleton} from "../../utils/CSingleton";
import {CDebug}     from "../../utils/CDebug";

const RPCClient = require("jsonrpc-node").TCP.Client;

export class CRPCClient extends CSingleton
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
	 * RPC client socket
	 ********************************************************************************************/
	public connect(name: string, host: string, port: number): any
	{
		if (this.m_socket[name] === undefined) {
			this.m_socket[name] = new RPCClient();
			this.m_socket[name].connect(port, host);
			this.onConnect(name, host, port);
		}
		return this.m_socket[name];
	}

	public socket(name: string): any
	{
		if (this.m_socket[name] === undefined) {
			CDebug.assert(false, "Not socket connection !!");
		}
		return this.m_socket[name];
	}

	protected onConnect(name: string, host: string, port: number): void
	{
		console.log(`[${name.toUpperCase()}] Socket client listening on url(${host}:${port})`);
	}
}