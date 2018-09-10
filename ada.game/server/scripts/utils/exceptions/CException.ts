"use strict";

import * as util from "util";
import {CDebug}  from "../CDebug";

export class CException extends Error
{
	protected errorCode: number;

	protected subInformation: object;

	public constructor(errorCode: number, isSkipLog: boolean = false, errorMessage?: string, subInformation?: object)
	{
		super(errorMessage);
		this.errorCode = errorCode;
		this.subInformation = subInformation;
		if (!isSkipLog) {
			CDebug.assert(false, this.writeErrorMessage());
		}
	}

	protected writeErrorMessage(): string
	{
		return util.format("[Exception] name(%s), stack(%s), ErrorMessage(%s), ErrorCode(%s), SubInformation: %j"
			, this.name, this.stack, this.message, 0, this.subInformation);
	}
}