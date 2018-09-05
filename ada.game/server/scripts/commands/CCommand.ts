"use strict";

import {CSessionModel}  from "../models/session/CSessionModel";
import {ICommandResult} from "./CCommandResult";

export abstract class CCommand
{
	public abstract async execute(uuid: number, dbShard: string, session: CSessionModel, params: Object): Promise<ICommandResult>;
}