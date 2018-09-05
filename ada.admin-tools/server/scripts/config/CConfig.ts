"use strict";

import {CDebug}         from "../utils/CDebug";
import {CEnvDevelop}    from "./environment/CEnvDevelop";
import {CEnvProduction} from "./environment/CEnvProduction";

export class CConfig
{
	public static Const = class
	{
		public static DEVELOP: string       = "develop";
		public static PRODUCTION: string    = "production";
	};

	protected static processMode = process.env.NODE_ENV;

	public static get Env()
	{
		if (this.processMode === CConfig.Const.DEVELOP) {
			return CEnvDevelop;
		}
		/**
		 * + Integration (통합 개발 환경)
		 * + QA (테스트 환경)
		 * + Staging (운영환경과 동일한 환경 검증)
		 */
		else if (this.processMode === CConfig.Const.PRODUCTION) {
			return CEnvProduction;
		}
		else {
			CDebug.assert(false, "[%s] Not find processMode", this.processMode);
		}
	}

	public static isProduction(): boolean
	{
		return this.processMode === this.Const.PRODUCTION;
	}
}