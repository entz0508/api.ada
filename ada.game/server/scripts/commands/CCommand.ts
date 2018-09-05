"use strict";

import {ICommandResult} from "./CCommandResult";

export abstract class CCommand
{
	public abstract async execute(uuid: number, shard: number, commands: object): Promise<ICommandResult>;
}