"use strict";

import {CScheduler}                    from "./utils/scheduler/CScheduler";
import {CDataInitialize}               from "./data/CDataInitialize";
import {CBroadcast, CBroadcastChannel} from "./utils/broadcast/CBroadcast";

class CAppInitialize
{
	public static callGC()
	{
		global.gc();
		console.log("[Total: " + process.memoryUsage().heapTotal +  "] Program is using " + process.memoryUsage().heapUsed + " bytes of Heap.");
	}

	public static async load(): Promise<void>
	{
		/********************************************************************************************
		 * scheduler
		 ********************************************************************************************/
		CScheduler.instance(CScheduler).schedule("NodeGC", 10, this.callGC);

		/********************************************************************************************
		 * broadcast
		 ********************************************************************************************/
		CBroadcast.instance(CBroadcast).register(CBroadcastChannel.LoadData, CDataInitialize.initialize);

		/********************************************************************************************
		 * data
		 ********************************************************************************************/
		await CDataInitialize.initialize();
	}
}

export = CAppInitialize;