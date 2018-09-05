"use strict";

import {CDataConst}                   from "../CDataConst";
import {CJson}                        from "../../utils/CJson";
import {CMemoryPool}                  from "../../utils/pool/CMemoryPool";
import {IPoolAbleObject}              from "../../utils/pool/IPoolAbleObject";
import {CMysql}                       from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                from "../../utils/database/mysql/CMysqlConnect";
import {CMysqlConst}                  from "../../utils/database/mysql/CMysqlConst";
import {CMysqlQuery, CMysqlQueryPool} from "../../utils/database/mysql/CMysqlQuery";
import {CTime}                        from "../../utils/time/CTime";

export class CJsonVersionData implements IPoolAbleObject
{
	protected m_versionCode: number     = -1;
	protected m_registrant: string      = "";
	protected m_description: string     = "";
	protected m_registTime: number      = -1;

	public init(versionCode: number, registrant: string, description: string): boolean
	{
		this.m_versionCode      = versionCode;
		this.m_registrant       = registrant;
		this.m_description      = description;
		return true;
	}

	public mapping(data: Object): void
	{
		this.m_versionCode      = CJson.safeIntegerParse(data, CDataConst.Keys.VersionCode);
		this.m_registrant       = CJson.safeStringParse( data, CDataConst.Keys.Registrant);
		this.m_description      = CJson.safeStringParse( data, CDataConst.Keys.Description);
		this.m_registTime       = CJson.safeIntegerParse(data, CDataConst.Keys.RegistTime);
	}

	public json(): Object
	{
		return {
			[CDataConst.Keys.VersionCode] : this.m_versionCode,
			[CDataConst.Keys.Registrant]  : this.m_registrant,
			[CDataConst.Keys.Description] : this.m_description,
			[CDataConst.Keys.RegistTime]  : this.m_registTime
		}
	}

	public get versionCode(): number
	{
		return this.m_versionCode;
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
	public static async getDataPool(version: number): Promise<CJsonVersionData>
	{
		const query: string = "CALL SpGetJsonVersion(?);";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, [version]);
		if (results.length < 1) {
			return null;
		}

		const instance: CJsonVersionData = CJsonVersionDataPool.alloc();
		instance.mapping(results[0]);
		return instance;
	}

	public static async getDataListPool(): Promise<CJsonVersionData[]>
	{
		const query: string = "CALL SpGetAllJsonVersion();";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, []);
		if (results[0].length < 1) {
			return null;
		}

		const response: CJsonVersionData[] = [];

		for (let idx: number = 0, count: number = results.length; idx < count; idx++) {
			const instance = CJsonVersionDataPool.alloc();
			instance.mapping(results[idx]);
			response.push(instance);
		}

		return response;
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async create(instance: CJsonVersionData): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.createQuery(instance));
	}

	public static createQuery(instance: CJsonVersionData): CMysqlQuery
	{
		return CMysqlQueryPool.alloc("CALL SpCreateJsonVersion(?, ?, ?, ?);",
			[
				instance.m_versionCode,
				instance.m_registrant,
				instance.m_description,
				CTime.Util.getServerTimeStamp()
			]
		);
	}

	/********************************************************************************************
	 * query.update
	 ********************************************************************************************/
	public static async update(instance: CJsonVersionData): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.updateQuery(instance));
	}

	public static updateQuery(instance: CJsonVersionData): CMysqlQuery
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
		return CMysqlQueryPool.alloc("CALL SpDeleteJsonVersion(?);" ,[version]);
	}

	/********************************************************************************************
	 * poolable interface
	 ********************************************************************************************/
	public release(): void
	{
		CJsonVersionDataPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_versionCode      = -1;
		this.m_registrant       = "";
		this.m_description      = "";
		this.m_registTime       = -1;
	}
}

export class CJsonVersionDataPool
{
	protected static ms_pool: CMemoryPool<CJsonVersionData> = new CMemoryPool<CJsonVersionData>(CJsonVersionData);

	public static alloc(versionCode: number = -1, registrant: string = "", description: string = ""): CJsonVersionData
	{
		const instance: CJsonVersionData = this.ms_pool.alloc();

		if (instance && instance.init(versionCode, registrant, description)) {
			return instance;
		}

		return null;
	}

	public static free(instance: CJsonVersionData): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}