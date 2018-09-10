"use strict";

import * as util from "util";
import * as winston from "winston";
import * as assert from "assert";

require("winston-daily-rotate-file");

export class CDebug
{
	protected static DEFAULT_CONDITION: boolean = false;

	protected static loggerOptions: winston.LoggerOptions = {
		levels: {error: 0, debug: 1, warn: 2, info: 3},
		colors: {error: "red", debug: "blue", warn: "yellow", info: "green"}
	};

	protected static winstonLog: winston.LoggerInstance = CDebug.winstonLogInstance();

	protected static winstonDebug: winston.LoggerInstance = CDebug.winstonDebugErrorInstance({
		dirname: "logs",
		filename: "server-",
		datePattern: "yyyy-MM-dd.log",
		level: "debug",
		json: false,
		handleExceptions: true,
		humanReadableUnhandledException: true
	});

	protected static winstonError: winston.LoggerInstance = CDebug.winstonDebugErrorInstance({
		dirname: "logs",
		filename: "server-exception-",
		datePattern: "yyyy-MM-dd.log",
		level: "error",
		json: false,
		handleExceptions: true,
		humanReadableUnhandledException: true
	});

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	protected static winstonLogInstance(): winston.LoggerInstance
	{
		return new winston.Logger({
			levels: this.loggerOptions.levels,
			colors: this.loggerOptions.colors,
			exitOnError: true,
			transports: [
				new winston.transports.Console({colorize: true})
			],
		});
	}

	protected static winstonDebugErrorInstance(dailyRotateFileTransportOptions?: winston.DailyRotateFileTransportOptions): winston.LoggerInstance
	{
		return new winston.Logger({
			levels: this.loggerOptions.levels,
			colors: this.loggerOptions.colors,
			exitOnError: true,
			transports: [
				new winston.transports.Console({colorize: true}),
				new winston.transports.DailyRotateFile(dailyRotateFileTransportOptions),
			],
		});
	}

	/********************************************************************************************
	 * Info
	 ********************************************************************************************/
	public static logInfo(message: string): void
	{
		this.winstonLog.info(message);
	}

	public static logInfoFormat(format: string, ...args: any[]): void
	{
		this.winstonLog.info(format, ...args);
	}

	/********************************************************************************************
	 * Warning
	 ********************************************************************************************/
	public static logWarning(message: string): void
	{
		this.winstonLog.warn(message);
	}

	public static logWarningFormat(format: string, ...args: any[]): void
	{
		this.winstonLog.warn(format, ...args);
	}

	/********************************************************************************************
	 * Error
	 ********************************************************************************************/
	public static logError(message: string): void
	{
		this.winstonError.error(message);
	}

	public static logErrorFormat(format: string, ...args: any[]): void
	{
		this.winstonError.error(format, ...args);
	}

	/********************************************************************************************
	 * Debug
	 ********************************************************************************************/
	public static logDebug(message: string): void
	{
		this.winstonDebug.debug(message);
	}

	public static logDebugFormat(format: string, ...args: any[]): void
	{
		this.winstonDebug.debug(format, ...args);
	}

	/********************************************************************************************
	 * Assert
	 ********************************************************************************************/
	public static assert(condition = this.DEFAULT_CONDITION, format: string, ...args: any[]): void
	{
		assert(condition, util.format(format, ...args));
	}
}