"use strict";

import {CExecuteCommand} from "./commands/CExecuteCommand";
import {CScheduler}      from "./utils/scheduler/CScheduler";

class CInitialize
{
	public static callGC()
	{
		global.gc();
		console.log("Program is using " + process.memoryUsage().heapUsed + " bytes of Heap.")
	}

	public static async loadInitialize(): Promise<void>
	{
		/********************************************************************************************
		 * init.gc
		 ********************************************************************************************/
		CScheduler.instance(CScheduler).schedule("NodeGC", 5, this.callGC);

		/********************************************************************************************
		 * init.execute.command
		 ********************************************************************************************/
		CExecuteCommand.instance(CExecuteCommand);
	}
}

export = CInitialize