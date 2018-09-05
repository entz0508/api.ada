"use strict";

import * as Path                      from "path";
import {CDataConst}                   from "../CDataConst";
import {CJson}                        from "../../utils/CJson";
import {CMemoryPool}                  from "../../utils/pool/CMemoryPool";
import {IPoolAbleObject}              from "../../utils/pool/IPoolAbleObject";
import {CMysql}                       from "../../utils/database/mysql/CMysql";
import {CMysqlConnect}                from "../../utils/database/mysql/CMysqlConnect";
import {CMysqlConst}                  from "../../utils/database/mysql/CMysqlConst";
import {CMysqlQuery, CMysqlQueryPool} from "../../utils/database/mysql/CMysqlQuery";
import {CTime}                        from "../../utils/time/CTime";

export class CJsonReleaseVersionData implements IPoolAbleObject
{
	protected m_versionCode: number     = -1;
	protected m_url: string             = "";

	protected m_registTime: number      = -1;
	protected m_updateTime: number      = -1;

	public init(versionCode: number, url: string): boolean
	{
		this.m_versionCode      = versionCode;
		this.m_url              = url;
		return true;
	}

	public mapping(data: Object): void
	{
		this.m_versionCode      = CJson.safeIntegerParse(data, CDataConst.Keys.VersionCode);
		this.m_url              = CJson.safeStringParse( data, CDataConst.Keys.URL);
		this.m_registTime       = CJson.safeIntegerParse(data, CDataConst.Keys.RegistTime);
		this.m_updateTime       = CJson.safeIntegerParse(data, CDataConst.Keys.UpdateTime);
	}

	public json(): Object
	{
		return {
			[CDataConst.Keys.VersionCode]   : this.m_versionCode,
			[CDataConst.Keys.URL]           : this.m_url,
			[CDataConst.Keys.RegistTime]    : this.m_registTime,
			[CDataConst.Keys.Description]   : this.m_updateTime
		}
	}

	public get versionCode(): number
	{
		return this.m_versionCode;
	}

	public set versionCode(versionCode: number)
	{
		this.m_versionCode = versionCode;
	}

	public get url(): string
	{
		return this.m_url;
	}

	public set url(url: string)
	{
		this.m_url = url;
	}

	public get registTime(): number
	{
		return this.m_registTime;
	}

	public get updateTime(): number
	{
		return this.m_updateTime;
	}

	public static makeUrl(host: string, path: string, version: number, extension: string = ".zip"): string
	{
		return Path.join(host, path, "" + version) + ".zip"
	}

	/********************************************************************************************
	 * query.select
	 ********************************************************************************************/
	public static async getDataPool(): Promise<CJsonReleaseVersionData>
	{
		const query: string = "CALL SpGetJsonReleaseVersion();";
		const results: any[] = await CMysql.queryPure(CMysqlConnect.instance(CMysqlConnect).dataDB(CMysqlConst.Slave), query, []);
		if (results.length < 1) {
			return null;
		}

		const instance: CJsonReleaseVersionData = CJsonReleaseVersionDataPool.alloc();
		instance.mapping(results[0]);
		return instance;
	}

	/********************************************************************************************
	 * query.insert
	 ********************************************************************************************/
	public static async create(instance: CJsonReleaseVersionData): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.createQuery(instance));
	}

	public static createQuery(instance: CJsonReleaseVersionData): CMysqlQuery
	{
		return CMysqlQueryPool.alloc("CALL SpCreateJsonReleaseVersion(?, ?, ?, ?);",[
				instance.m_versionCode,
				instance.m_url,
				CTime.Util.getServerTimeStamp(),
				CTime.Util.getServerTimeStamp()
			]
		);
	}

	/********************************************************************************************
	 * query.update
	 ********************************************************************************************/
	public static async update(instance: CJsonReleaseVersionData): Promise<void>
	{
		await CMysql.query(CMysqlConnect.instance(CMysqlConnect).dataDB(), this.updateQuery(instance));
	}

	public static updateQuery(instance: CJsonReleaseVersionData): CMysqlQuery
	{
		return CMysqlQueryPool.alloc("CALL SpUpdateJsonReleaseVersion(?, ?, ?);",[
			instance.m_versionCode,
			instance.m_url,
			CTime.Util.getServerTimeStamp()
		]);
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
		CJsonReleaseVersionDataPool.free(this);
	}

	public onAlloc(): void
	{

	}

	public onFree(): void
	{
		this.m_versionCode      = -1;
		this.m_url              = "";
		this.m_registTime       = -1;
		this.m_updateTime       = -1;
	}
}

export class CJsonReleaseVersionDataPool
{
	protected static ms_pool: CMemoryPool<CJsonReleaseVersionData> = new CMemoryPool<CJsonReleaseVersionData>(CJsonReleaseVersionData);

	public static alloc(versionCode: number = -1, url: string = ""): CJsonReleaseVersionData
	{
		const instance: CJsonReleaseVersionData = this.ms_pool.alloc();

		if (instance && instance.init(versionCode, url)) {
			return instance;
		}

		return null;
	}

	public static free(instance: CJsonReleaseVersionData): void
	{
		if (instance) {
			this.ms_pool.free(instance);
		}
	}
}