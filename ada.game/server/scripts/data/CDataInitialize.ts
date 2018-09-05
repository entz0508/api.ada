"use strict";

import {CJsonReleaseVersionData} from "./version/CJsonReleaseVersionData";
import {CData}                   from "./CData";

export class CDataInitialize
{
	public static async initialize(args?: Object[]): Promise<void>
	{
		const CJsonReleaseVersion: CJsonReleaseVersionData = await CJsonReleaseVersionData.getDataPool();
		if (CJsonReleaseVersion !== null) {
			await CData.load(CJsonReleaseVersion.versionCode);

			CJsonReleaseVersion.release();
		}
	}
}