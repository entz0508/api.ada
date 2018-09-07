"use strict";

import {IMysqlShardPoolConfig, IMysqlPoolConfig} from "../../utils/database/mysql/CMysqlConnect";

export class CEnvProduction
{
	public static SessionExpireSeconds: number  = 3000;

	public static Path = class
	{
		public static JSONSavePath: string      = "/service/temp/upload/json";
		public static CDNSavePath: string       = "/service/temp/upload/cdn";

		public static DownloadURL: string       = "http://35.236.172.130:22";
	};

	public static RedisMaster = class
	{
		public static Host: string      = "35.236.172.130";
		public static Port: number      = 6379;
		public static Database: number  = 0;
		public static Password: string  = "";
	};

	public static Mysql = class
	{
		public static DataMaster    : IMysqlPoolConfig    = {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaData",   multipleStatements: true};
		public static DataSlave     : IMysqlPoolConfig    = {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaData",   multipleStatements: true};

		public static CommonMaster  : IMysqlPoolConfig    = {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaCommon", multipleStatements: true};
		public static CommonSlave   : IMysqlPoolConfig    = {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaCommon", multipleStatements: true};

		public static UserMaster: IMysqlShardPoolConfig   = {
			"1": {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaUser", multipleStatements: true},
			"2": {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaUser", multipleStatements: true},
		};

		public static UserSlave: IMysqlShardPoolConfig    = {
			"1": {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaUser", multipleStatements: true},
			"2": {host: "35.236.172.130", port: 3306, user: "root", password: "fashionInTech##99", database: "AdaUser", multipleStatements: true},
		};
	};

	public static Google = class
	{
		public static webAPIKey: string = "AIzaSyAfbAIZjnUpZXZwQCu207uEl0NrozciFtw";
	};
}