"use strict";

import * as path                                      from "path";
import {Application, NextFunction, Request, Response} from "express";
import {CRoute}                                       from "../CRoute";
import {CDebug}                                       from "../../utils/CDebug";
import {CJson}                                        from "../../utils/CJson";
import {CFileUploader}                                from "../../utils/uploader/CFileUploader";
import {CConfig}                                      from "../../config/CConfig";
import {CFileSystem}                                  from "../../utils/filesystem/CFileSystem";
import {CJsonVersionData, CJsonVersionDataPool}       from "../../data/version/CJsonVersionData";
import {CMysqlQuery}                                  from "../../utils/database/mysql/CMysqlQuery";
import {CMysql}                                       from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                                from "../../utils/database/mysql/CMysqlConnect";
import {CJsonReleaseVersionData}                      from "../../data/version/CJsonReleaseVersionData";

export class CDataUploadRoute extends CRoute
{
	public static create(app: Application): void
	{
		/** http://xxx/data/upload/json */
		app.route("/data/upload/json")
			.get(async (req: Request, res: Response, next: NextFunction): Promise<Response> =>
			{
				try {
					const response: Object[] = [];

					const CJsonVersions: CJsonVersionData[] = await CJsonVersionData.getDataListPool();
					const count: number = CJsonVersions.length;
					for (let idx: number = 0; idx < count; ++idx) {
						response.push(CJsonVersions[idx].json());
						CJsonVersions[idx].release();
					}

					return this.response(req, res, {"data": response});
				}
				catch (exception) {
					CDebug.logError(exception);
					return this.response(req, res, exception.stack);
				}
			})
			.post(async (req: any, res: Response, next: NextFunction): Promise<Response> =>
			{
				try {
					const response: Object          = {};
					const queries: CMysqlQuery[]    = [];
					const files: any[]              = req["files"]["file"];
					const versionCode: number       = CJson.safeIntegerParse(req.body, "versionCode");
					const registrant: string        = CJson.safeStringParse(req.body, "registrant");
					const description: string       = CJson.safeStringParse(req.body, "description");

					const JSONDirSavePath: string   = path.join(CConfig.Env.Path.JSONSavePath, "" + versionCode);
					const CDNDirSavePath: string    = path.join(CConfig.Env.Path.CDNSavePath , "" + versionCode);

					await CFileSystem.ensureDir(JSONDirSavePath);
					await CFileSystem.ensureDir(CConfig.Env.Path.CDNSavePath);

					const count: number = files.length;
					for (let idx: number = 0; idx < count; ++idx) {
						const file: any = files[idx];
						const originalFilename: string  = CJson.safeStringParse(file, "originalFilename");
						const originalFilePath: string  = CJson.safeStringParse(file, "path");
						const filename: string          = CFileUploader.removeFileExtension(originalFilename);
						const JSONFileSavePath: string  = path.join(JSONDirSavePath, originalFilename);

						// JSON 파일 이동
						await CFileSystem.move(originalFilePath, JSONFileSavePath, {overwrite: true});

						const JSONData: any = await CFileSystem.readFile(JSONFileSavePath, {encoding: "utf8"});

						/**********************************************************************************************************
						 * data write
						 **********************************************************************************************************/
					}

					/**********************************************************************************************************
					 * create .zip
					 **********************************************************************************************************/
					await CFileSystem.streamJSONFile(JSONDirSavePath, CDNDirSavePath);

					/**********************************************************************************************************
					 * create.jsonVersion
					 **********************************************************************************************************/
					const CJsonVersion: CJsonVersionData = CJsonVersionDataPool.alloc(versionCode, registrant, description);
					queries.push(CJsonVersionData.createQuery(CJsonVersion));

					await CMysql.transactionQueryList(CMysqlConnect.instance(CMysqlConnect).dataDB(), queries);

					CJsonVersion.release();

					return this.response(req, res, response);
				}
				catch (exception) {
					CDebug.logError(exception);
					return this.response(req, res, exception.stack);
				}
			})
			.delete(async (req: Request, res: Response, next: NextFunction): Promise<Response> =>
			{
				try {
					const response: any = {"state": true};

					const versionCode: number = CJson.safeIntegerParse(req.body, "versionCode");

					const CJsonReleaseVersion = await CJsonReleaseVersionData.getDataPool();
					if (CJsonReleaseVersion !== null && CJsonReleaseVersion.versionCode === versionCode) {
						// skip;
						response["state"] = false;
					}
					else {
						await CJsonVersionData.delete(versionCode);
					}

					return this.response(req, res, response);
				}
				catch (exception) {
					CDebug.logError(exception);
					return this.response(req, res, exception.stack);
				}
			});
	}
}