"use strict";

import * as express        from "express";
import * as logger         from "morgan";
import * as cookieParser   from "cookie-parser";
import * as bodyParser     from "body-parser";
import * as methodOverride from "method-override";
import {CGameGateway}      from "./routes/gateway/CGameGateway";
import {CPlatformGateway}  from "./routes/gateway/CPlatformGateway";
import {CAuthGateway}      from "./routes/gateway/CAuthGateway";

const morganBody    = require("morgan-body");
const multiparty    = require("connect-multiparty");
const RPCServer     = require("jsonrpc-node").Server;

class Server
{
	protected m_app: express.Application;

	public static create(): Server
	{
		return new Server();
	}

	constructor()
	{
		this.m_app = express();
		this.loadConfig();
		this.loadRoutes();
	}

	public get app(): express.Application
	{
		return this.m_app;
	}

	protected loadConfig(): void
	{
		// mount logger
		this.app.use(logger("dev"));

		// mount json form parser
		this.app.use(bodyParser.json());

		// mount query string parser
		this.app.use(bodyParser.urlencoded({extended: true}));

		this.app.use(cookieParser());

		this.app.use(multiparty());

		this.app.use(methodOverride());

		/*******************************************************************************************
		 * HTTP request logger middleware (https://github.com/sirrodgepodge/morgan-body)
		 *
		 * {
		 *   maxBodyLength   : (default: 1000), caps the length of the console output of a single request/response to specified length,
		 *   logDateTime     : (default: true), options to false disables logging request date + time,
		 *   dateTimeFormat  : (default: 'utc', available: ['edt', clf', 'iso', 'utc']), lets you specify dateTime format logged if "logDateTime" options is true (otherwise dateTime not logged anyways)
		 *   timezone        : (default: server's local timezone), time will be logged in the specified timezone. e.g. "EST", "America/Los_Angeles", "Asia/Kolkata" (for Indian Standard Time), etc. Internally uses "momentjs" for interpreting the timezone, and if specified value is not understood by momentjs, falls back to using the local timezone. (Please have a look at the TZ column here for a lit of supported timezone strings: https://wikipedia.org/wiki/List_of_tz_database_time_zones#List).
		 *   logReqUserAgent : (default: true), options to false disables logging request user agent,
		 *   logRequestBody  : (default: true), options to false disables logging request body,
		 *   logResponseBody : (default: true), options to false disables logging response body
		 * }
		 *******************************************************************************************/
		// morganBody(this.app);

		// error handler
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			err.status = 404;
			next(err);
		});

		process.on("uncaughtException", (err: any) => {
			console.error("uncaughtException: " + err.stack);
		});
	}

	protected loadRoutes(): void
	{
		const router: express.Router = express.Router();
		CAuthGateway.create(router);
		CGameGateway.create(router);
		CPlatformGateway.create(router);
		this.app.use(router);
	}

}


export = (Server.create()).app;