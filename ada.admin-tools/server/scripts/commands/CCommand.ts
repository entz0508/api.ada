"use strict";

import {ICommandResult} from "./CCommandResult";

export abstract class CCommand
{
	public abstract async execute(uuid: number, dbShard: string, params: Object): Promise<ICommandResult>;
}