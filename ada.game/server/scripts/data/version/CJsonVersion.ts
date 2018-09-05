"use strict";

import {CDataConst}                   from "../CDataConst";
import {CJson}                        from "../../utils/CJson";
import {CMemoryPool}                  from "../../utils/pool/CMemoryPool";
import {IPoolAbleObject}              from "../../utils/pool/IPoolAbleObject";
import {CMysql}                       from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                from "../../utils/database/mysql/CMysqlConnect";
import {CMysqlConst}                  from "../../utils/database/mysql/CMysqlConst";
import {CMysqlQuery, CMysqlQueryPool} from "../../utils/database/mysql/CMysqlQuery";

export class CJsonVersion implements IPoolAbleObject
{
	protected m_version: string         = "";
	protected m_registrant: string      = "";
	protected m_description: string     = "";
	protected m_registTime: number      = -1;

	public init(): boolean
	{
		return true;
	}

	public mapping(data: Object): void
	{
		this.m_version          = CJson.safeStringParse( data, CDataConst.Keys.Version);
		this.m_registrant       = CJson.safeStringParse( data, CDataConst.Keys.Registrant);
		this.m_description      = CJson.safeStringParse( data, CDataConst.Keys.Description);
		this.m_registTime       = CJson.safeIntegerParse(data, CDataConst.Keys.RegistTime);
	}

	public get version(): string
	{
		return this.m_version;
	}

	public get registrant(): string
	{
		return this.m_registrant;
	}

	public get description(): string
	{
		return this.m_description;
	}

	public get registTime(): number
	{
		return this.m_registTime;
	}

	/********************************************************************************************
	 * query.select
	 ********************************************************************************************/
	public static async getData(version: string): Promise<CJsonVersion>
	{
		const query: string = ";";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, [version]);
		if (results.length < 1) {
			return null;
		}

		const instance = CJsonVersionPool.alloc();
		instance.mapping(results[0]);
		return instance;
	}

	public static async getDataList(): Promise<CJsonVersion[]>
	{
		const query: string = ";";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, []);
		if (results.length < 1) {
			return null;
		}

		const response: CJsonVersion[] = [];

		for (let idx: number = 0, count: number = results.length; idx < count; idx++) {
			const instance = CJsonVersionPool.alloc();
			instance.mapping(results[idx]);
			response.push(instance);
		}

		return response;
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async insert(instance: CJsonVersion)
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.insertQuery(instance));
	}

	public static insertQuery(instance: CJsonVersion): CMysqlQuery
	{
		return CMysqlQueryPool.alloc(";",[]);
	}

	/********************************************************************************************
	 * query.update
	 ********************************************************************************************/
	public static async update(instance: CJsonVersion)
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.updateQuery(instance));
	}

	public static updateQuery(instance: CJsonVersion): CMysqlQuery
	{
		return CMysqlQueryPool.alloc(";",[]);
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
		return CMysqlQueryPool.alloc(";" ,[version]);
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CJsonVersionPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_version          = "";
		this.m_registrant       = "";
		this.m_description      = "";
		this.m_registTime       = -1;
	}
}

export class CJsonVersionPool
{
	protected static ms_pool: CMemoryPool<CJsonVersion> = new CMemoryPool<CJsonVersion>(CJsonVersion);

	public static alloc(): CJsonVersion
	{
		const instance: CJsonVersion = this.ms_pool.alloc();

		if (instance && instance.init()) {
			return instance;
		}

		return null;
	}

	public static free(instance: CJsonVersion): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}