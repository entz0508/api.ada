"use strict";

import {CNetworkConst}        from "./CNetworkConst";
import {CJson}                from "../utils/CJson";

export namespace INetworkPacketWriter
{
	export interface Response
	{
		session: string;
		version: number;
		status: number;
		sessionRegistTime: number;
		sessionUpdateTime: number;
		sessionExpireTime: number;
		results: object;
	}
}

export class CNetworkPacketWriter
{
	public static Request(response: Object): INetworkPacketWriter.Response
	{
		const JSONData: INetworkPacketWriter.Response = {
			"session"               : CJson.safeStringParse( response, CNetworkConst.Keys.Session),
			"version"               : CJson.safeIntegerParse(response, CNetworkConst.Keys.DataVersion),
			"status"                : CJson.safeIntegerParse(response, CNetworkConst.Keys.Status),
			"sessionRegistTime"     : CJson.safeIntegerParse(response, CNetworkConst.Keys.SessionRegistTime),
			"sessionUpdateTime"     : CJson.safeIntegerParse(response, CNetworkConst.Keys.SessionUpdateTime),
			"sessionExpireTime"     : CJson.safeIntegerParse(response, CNetworkConst.Keys.SessionExpireTime),
			"results"               : CJson.safeObjectParse( response, CNetworkConst.Keys.ResultData)
		};
		return JSONData;
	}
}