"use strict";

import {CDebug}      from "../utils/CDebug";
import {CReleaseEnv} from "./environment/CReleaseEnv";
import {CDevelopEnv} from "./environment/CDevelopEnv";

export class CConfig
{
	public static Const = class
	{
		public static DEVELOP: string   = "develop";
		public static ALPHA: string     = "alpha";
		public static BETA: string      = "beta";
		public static RELEASE: string   = "release";
	};

	protected static processMode = process.env.NODE_ENV;

	public static get Environment()
	{
		if (this.processMode === CConfig.Const.DEVELOP) {
			return CDevelopEnv;
		}
		else if (this.processMode === CConfig.Const.RELEASE) {
			return CReleaseEnv;
		}
		else {
			CDebug.assert(false, "[%s] Not find processMode", this.processMode);
		}
	}

	public static isRelease(): boolean
	{
		return this.processMode === "release";
	}
}