"use strict";

import {Request, Response, Router} from "express";
import {CIPAddress}                from "../utils/CIPAddress";
import {CTime}                     from "../utils/time/CTime";
import {CDebug}                    from "../utils/CDebug";
import {CConfig}                   from "../config/CConfig";

export class CRoute
{
    protected static getIPAddress(req: Request): string
    {
        let ip: string = req.connection.remoteAddress || req.socket.remoteAddress;
        if (! CIPAddress.isValid(ip)) {
            ip = CIPAddress.getIPAddress(ip);
        }
        return ip;
    }

    protected static debugRequest(request: Request): void
    {
    	if (! CConfig.isRelease()) {
		    CDebug.logDebugFormat("------>> Date(%s)", new Date(CTime.Util.getServerTimeStamp()));
		    CDebug.logDebugFormat("------>> Method(%s)", request.method);
		    CDebug.logDebugFormat("------>> URL(%s%s)", request.headers.host, request.url);
		    CDebug.logDebugFormat("------>> Accept-encoding(%s)", request.headers["accept-encoding"]);
		    CDebug.logDebugFormat("------>> Connection(%s)", request.headers["connection"]);
		    CDebug.logDebugFormat("------>> Content-length(%s)", request.headers["content-length"]);
		    CDebug.logDebugFormat("------>> User-agent(%s)", request.headers["user-agent"]);
		    CDebug.logDebugFormat("------>> Connect-ip(%s)", this.getIPAddress(request));
		    CDebug.logDebugFormat("------>> Request: %j", request.body);
	    }
    }

    protected static debugResponse(response: Object): void
    {
	    if (! CConfig.isRelease()) {
		    CDebug.logDebugFormat("<<------ Response: %j", response);
	    }
    }

    protected static response(request: Request, response: Response, results: Object): Response
    {
	    return response.json(results);
    }
}