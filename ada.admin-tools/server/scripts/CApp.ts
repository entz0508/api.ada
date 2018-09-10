"use strict";

import * as express        from "express";
import * as path           from "path";
import * as logger         from "morgan";
import * as cookieParser   from "cookie-parser";
import * as bodyParser     from "body-parser";
import * as methodOverride from "method-override";
import {CDataVersionRoute} from "./routes/data/CDataVersionRoute";
import {Request}           from "express";
import {Response}          from "express";
import {NextFunction}      from "express";
import {CDataUploadRoute}  from "./routes/data/CDataUploadRoute";
import {CDebug}            from "./utils/CDebug";

const morganBody = require("morgan-body");
const multiparty = require("connect-multiparty");

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
		// configure jade
		this.app.set("views", path.join(__dirname, "views"));
		this.app.set("view engine", "jade");

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
		morganBody(this.m_app);

		// add static paths
		this.app.use(express.static(path.join(__dirname, "./")));

		// error handler
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			err.status = 404;
			next(err);
		});

		process.on("uncaughtException", (err: any) => {
			CDebug.logErrorFormat("uncaughtException: %j", err.stack);
		});
	}

	protected loadRoutes(): void
	{
		this.app.use("/*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
			res.header("Access-Control-Allow-Headers", "*");
			next();
		});

		/********************************************************************************************
		 * data
		 ********************************************************************************************/
		CDataUploadRoute.create(this.m_app);
		CDataVersionRoute.create(this.m_app);
	}
}

export = (Server.create()).app;