"use strict";

import * as mysql    from "mysql";
import {CSingleton}  from "../../CSingleton";
import {CConfig}     from "../../../config/CConfig";
import {CMysqlConst} from "./CMysqlConst";

import promiseMysql  = require("promise-mysql");

const consistentHashing = require("consistent-hashing");

export interface IMysqlShardPoolConfig
{
	readonly [key: string]: IMysqlPoolConfig;
}

export interface IMysqlPoolConfig
{
	readonly host: string;
	readonly port: number;
	readonly user: string;
	readonly password: string;
	readonly database: string;
	readonly multipleStatements: boolean;
}

export class CMysqlConnect extends CSingleton
{
	protected m_hashInstance: any = null;

	/********************************************************************************************
	 * data
	 ********************************************************************************************/
	protected m_dataMaster      : promiseMysql.Pool		= null;
	protected m_dataSlave       : promiseMysql.Pool		= null;

	/********************************************************************************************
	 * common
	 ********************************************************************************************/
	protected m_commonMaster    : promiseMysql.Pool		= null;
	protected m_commonSlave     : promiseMysql.Pool		= null;

	/********************************************************************************************
	 * game
	 ********************************************************************************************/
	protected m_useMaster       : Map<number, promiseMysql.Pool>	= new Map<number, promiseMysql.Pool>();
	protected m_userSlave       : Map<number, promiseMysql.Pool>    = new Map<number, promiseMysql.Pool>();

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	protected onInstantiate(): void
	{
	}

	protected onDestroyInstance(): void
	{
	}

	protected getConnection(config: IMysqlPoolConfig): promiseMysql.Pool
	{
		const poolConfig: mysql.PoolConfig = {
			host: config.host,
			user: config.user,
			port: config.port,
			password: config.password,
			database: config.database,
			multipleStatements: config.multipleStatements,
		};
		return promiseMysql.createPool(poolConfig);
	}

	/********************************************************************************************
	 * shard
	 ********************************************************************************************/
	protected createConsistentHash(m_config: IMysqlShardPoolConfig): any
	{
		const nodeStringList: string[] = Object.keys(m_config);
		return new consistentHashing(nodeStringList);       // [0, 1, 2, 3]
	}

	public getConsistentHashNode(uuid: string)
	{
		if (! this.m_hashInstance) {
			this.m_hashInstance = this.createConsistentHash(CConfig.Env.Mysql.UserMaster);
		}
		return this.m_hashInstance.getNode(uuid);
	}

	/********************************************************************************************
	 * database.data
	 ********************************************************************************************/
	public dataDB(server = CMysqlConst.Master): promiseMysql.Pool
	{
		let pool: promiseMysql.Pool = (server === CMysqlConst.Master) ? this.m_dataMaster : this.m_dataSlave;

		if (! pool) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.DataMaster
				: CConfig.Env.Mysql.DataSlave;
			pool = this.getConnection(dbInfo);
		}

		return pool;
	}

	/********************************************************************************************
	 * database.common
	 ********************************************************************************************/
	public commonDB(server = CMysqlConst.Master): promiseMysql.Pool
	{
		let pool: promiseMysql.Pool = (server === CMysqlConst.Master) ? this.m_commonMaster : this.m_commonSlave;

		if (! pool) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.CommonMaster
				: CConfig.Env.Mysql.CommonSlave;
			pool = this.getConnection(dbInfo);
		}

		return pool;
	}

	/********************************************************************************************
	 * database.game
	 ********************************************************************************************/
	public userDB(shard: number, server = CMysqlConst.Master): promiseMysql.Pool
	{
		const poolObject: Map<number, promiseMysql.Pool> = (server === CMysqlConst.Master) ? this.m_useMaster : this.m_userSlave;

		if (! poolObject.get(shard)) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.UserMaster[shard]
				: CConfig.Env.Mysql.UserSlave[shard];
			poolObject.set(shard, this.getConnection(dbInfo));
		}

		return poolObject.get(shard);
	}
}