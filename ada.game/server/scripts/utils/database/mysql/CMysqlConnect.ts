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
	protected m_useMaster       : promiseMysql.Pool		= null;
	protected m_userSlave       : promiseMysql.Pool		= null;

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	protected onInstantiate(): void
	{

	};

	protected onDestroyInstance(): void
	{

	};

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
		const db: string = (server === CMysqlConst.Master) ? "m_dataMaster" : "m_dataSlave";

		if (! this[db]) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.DataMaster
				: CConfig.Env.Mysql.DataSlave;
			this[db] = this.getConnection(dbInfo);
		}

		return this[db];
	}

	/********************************************************************************************
	 * database.common
	 ********************************************************************************************/
	public commonDB(server = CMysqlConst.Master): promiseMysql.Pool
	{
		const db: string = (server === CMysqlConst.Master) ? "m_commonMaster" : "m_commonSlave";

		if (! this[db]) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.CommonMaster
				: CConfig.Env.Mysql.CommonSlave;
			this[db] = this.getConnection(dbInfo);
		}

		return this[db];
	}

	/********************************************************************************************
	 * database.game
	 ********************************************************************************************/
	public userDB(shard: string, server = CMysqlConst.Master): promiseMysql.Pool
	{
		const db: string = (server === CMysqlConst.Master) ? "m_useMaster" : "m_userSlave";

		if (this[db] === null) this[db] = {};

		if (! this[db][shard]) {
			const dbInfo: IMysqlPoolConfig = (server === CMysqlConst.Master)
				? CConfig.Env.Mysql.UserMaster[shard]
				: CConfig.Env.Mysql.UserSlave[shard];
			this[db][shard] = this.getConnection(dbInfo);
		}

		return this[db][shard];
	}
}