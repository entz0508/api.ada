"use strict";

import {Application, NextFunction, Request, Response}         from "express";
import {CRoute}                                               from "../CRoute";
import {CDebug}                                               from "../../utils/CDebug";
import {CJson}                                                from "../../utils/CJson";
import {CConfig}                                              from "../../config/CConfig";
import {CMysqlQuery}                                          from "../../utils/database/mysql/CMysqlQuery";
import {CMysql}                                               from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                                        from "../../utils/database/mysql/CMysqlConnect";
import {CJsonVersionData}                                     from "../../data/version/CJsonVersionData";
import {CJsonReleaseVersionData, CJsonReleaseVersionDataPool} from "../../data/version/CJsonReleaseVersionData";

export class CDataVersionRoute extends CRoute
{
	public static create(app: Application): void
	{
		/** http://xxx/data/release/json/version */
		app.route("/data/release/json/version")
			.get(async (req: Request, res: Response, next: NextFunction): Promise<Response> =>
			{
				try {
					let response: Object = {};

					const CJsonReleaseVersion = await CJsonReleaseVersionData.getDataPool();
					if (CJsonReleaseVersion !== null) {
						response = CJsonReleaseVersion.json();
						CJsonReleaseVersion.release();
					}

					return this.response(req, res, response);
				}
				catch (exception) {
					CDebug.logError(exception);
					return this.response(req, res, exception.stack);
				}
			})
			.put(async (req: Request, res: Response, next: NextFunction): Promise<Response> =>
			{
				try {
					const response: Object          = {};
					const queries: CMysqlQuery[]    = [];
					const versionCode: number       = CJson.safeIntegerParse(req.body, "versionCode");

					let [CJsonVersion, CJsonReleaseVersion]: [CJsonVersionData, CJsonReleaseVersionData] = await Promise.all(
						[
							CJsonVersionData.getDataPool(versionCode),
							CJsonReleaseVersionData.getDataPool()
						]
					);

					if (CJsonVersion === null) {
						// error
					}

					if (CJsonReleaseVersion === null) {
						CJsonReleaseVersion = CJsonReleaseVersionDataPool.alloc(
							versionCode,
							CJsonReleaseVersionData.makeUrl(CConfig.Env.Path.DownloadURL, CConfig.Env.Path.CDNSavePath, versionCode)
						);
						queries.push(CJsonReleaseVersionData.createQuery(CJsonReleaseVersion));
					}
					else if (CJsonReleaseVersion !== null && versionCode !== CJsonReleaseVersion.versionCode) {
						CJsonReleaseVersion.versionCode = CJsonVersion.versionCode;
						CJsonReleaseVersion.url         = CJsonReleaseVersionData.makeUrl(CConfig.Env.Path.DownloadURL, CConfig.Env.Path.CDNSavePath, versionCode);
						queries.push(CJsonReleaseVersionData.updateQuery(CJsonReleaseVersion));
					}
					else {
						CDebug.logDebug(`Same version(${versionCode})`);
					}

					CJsonReleaseVersion.release();
					CJsonVersion.release();

					await CMysql.transactionQueryList(CMysqlConnect.instance(CMysqlConnect).dataDB(), queries);

					this.response(req, res, response);
				}
				catch (exception) {
					CDebug.logError(exception);
					return this.response(req, res, exception.stack);
				}
			});
	}
}
