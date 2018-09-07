"use strict";

import {CScheduler} from "./utils/scheduler/CScheduler";
import {CRPCClient} from "./network/RPC/CRpcClient";
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
		CScheduler.instance(CScheduler).schedule("nodeGC", 10, this.callGC);

		/********************************************************************************************
		 * tcp connect
		 ********************************************************************************************/
		CRPCClient.instance(CRPCClient).connect("login",    CConfig.Env.TCP.Platform.Host, CConfig.Env.TCP.Platform.Port);
		CRPCClient.instance(CRPCClient).connect("platform", CConfig.Env.TCP.Platform.Host, CConfig.Env.TCP.Platform.Port);
		CRPCClient.instance(CRPCClient).connect("game",     CConfig.Env.TCP.Game.Host, CConfig.Env.TCP.Game.Port);

	}
}

export = CAppInitialize;