"use strict";

import {CMysql}                            from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                     from "../../utils/database/mysql/CMysqlConnect";
import {CMysqlConst}                       from "../../utils/database/mysql/CMysqlConst";
import {CMysqlQuery, CMysqlQueryPool}      from "../../utils/database/mysql/CMysqlQuery";
import {PartsItemXls_Parser, PartsItemXls} from "../entity/PartsItemXls_Parser";

export class CPartsItemXlsTblAssetDao
{
	/********************************************************************************************
	 * query.select
	 ********************************************************************************************/
	public static async getDataList(version: number): Promise<Map<number, PartsItemXls>>
	{
		const query: string = "CALL SpGetPartsItemXlsTblAssetData(?);";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, [version]);
		if (results.length < 1) {
			return null;
		}

		return PartsItemXls_Parser.mapping(results[0]);
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async create(version: number, data: Object): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.createQuery(version, data));
	}

	public static createQuery(version: number, data: Object): CMysqlQuery
	{
		return CMysqlQueryPool.alloc("CALL SpCreatePartsItemXlsTblAssetData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
			[

			]
		);
	}

	/********************************************************************************************
	 * query.delete
	 ********************************************************************************************/
	public static async delete(version: number): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.deleteQuery(version));
	}

	public static deleteQuery(version: number): CMysqlQuery
	{
		return CMysqlQueryPool.alloc("CALL SpDeletePartsItemXlsTblAssetData(?);" ,[version]);
	}
}