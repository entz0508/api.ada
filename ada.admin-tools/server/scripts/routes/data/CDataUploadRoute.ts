"use strict";

import * as path                                 from "path";
import {CRoute}                                  from "../CRoute";
import {NextFunction, Request, Response, Router} from "express";
import {CDebug}                                  from "../../utils/CDebug";
import {CJson}                                   from "../../utils/CJson";
import {CFileUploader}                           from "../../utils/uploader/CFileUploader";
import {CConfig}                                 from "../../config/CConfig";
import {CFileSystem}                             from "../../utils/filesystem/CFileSystem";
import {CJsonVersionData, CJsonVersionDataPool}  from "../../data/version/CJsonVersionData";
import {CMysqlQuery}                             from "../../utils/database/mysql/CMysqlQuery";
import {CMysql}                                  from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                           from "../../utils/database/mysql/CMysqlConnect";

export class CDataUploadRoute extends CRoute
{
	public static create(router: Router): void
	{
		router.all("/*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
			res.header("Access-Control-Allow-Headers", "*");
			next();
		});

		router.post("/data/upload", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
			try {
				this.debugRequest(req);

				const response: Object          = {};
				const queries: CMysqlQuery[]    = [];
				const files: any[]              = req["files"]["file"];
				const versionCode: number       = CJson.safeIntegerParse(req.body, "versionCode");
				const registrant: string        = CJson.safeStringParse( req.body, "registrant");
				const description: string       = CJson.safeStringParse( req.body, "description");

				const JSONDirSavePath: string   = path.join(CConfig.Environment.Path.JSONSavePath, "" + versionCode);
				const CDNDirSavePath: string    = path.join(CConfig.Environment.Path.CDNSavePath, "" + versionCode);

				await CFileSystem.ensureDir(JSONDirSavePath);
				await CFileSystem.ensureDir(CConfig.Environment.Path.CDNSavePath);

				const count: number = files.length;
				for (let idx: number = 0; idx < count; ++idx) {
					const file: any                     = files[idx];
					const originalFilename: string      = CJson.safeStringParse(file, "originalFilename");
					const originalFilePath: string      = CJson.safeStringParse(file, "path");
					const filename: string              = CFileUploader.removeFileExtension(originalFilename);
					const JSONFileSavePath: string      = path.join(JSONDirSavePath, originalFilename);

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

				this.debugResponse(res);

				return this.response(req, res, response);
			}
			catch (exception) {
				CDebug.logError(exception);
				return this.response(req, res, exception.stack);
			}
		});

		router.get("/data/upload/list", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
			try {
				this.debugRequest(req);

				const response: Object[] = [];

				const CJsonVersions: CJsonVersionData[] = await CJsonVersionData.getDataList();
				const count: number = CJsonVersions.length;
				for (let idx: number = 0; idx < count; ++idx) {
					response.push(CJsonVersions[idx].json());
				}

				this.debugResponse(res);

				return this.response(req, res, {"data": response});
			}
			catch (exception) {
				CDebug.logError(exception);
				return this.response(req, res, exception.stack);
			}
		});
	}
}
