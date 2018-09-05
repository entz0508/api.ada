"use strict";

import {CScheduler} from "./utils/scheduler/CScheduler";
import {CRpcServer} from "./network/RPC/CRpcServer";
import {CRpcClient} from "./network/RPC/CRpcClient";
import {CConfig}    from "./config/CConfig";

class CAppInitialize
{
	public static callGC()
	{
		global.gc();
		// console.log("Program is using " + process.memoryUsage().heapUsed + " bytes of Heap.");
	}

	public static async load(): Promise<void>
	{
		/********************************************************************************************
		 * scheduler
		 ********************************************************************************************/
		CScheduler.instance(CScheduler).schedule("NodeGC", 10, this.callGC);

		// server on
		// await CRpcServer.instance(CRpcServer).connect("game", 9001);

		// client connect
		CRpcClient.instance(CRpcClient).connect("game", CConfig.Env.TCP.Game.Host, CConfig.Env.TCP.Game.Port);
	}
}

export = CAppInitialize;