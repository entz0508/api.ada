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
		tokenRegistTime: number;
		tokenUpdateTime: number;
		tokenExpireTime: number;
		results: object;
	}
}

export class CNetworkPacketWriter
{
	public static Request(response: Object): INetworkPacketWriter.Response
	{
		const JSONData: INetworkPacketWriter.Response = {
			"session"               : CJson.safeStringParse( response, CNetworkConst.Keys.Token),
			"version"               : CJson.safeIntegerParse(response, CNetworkConst.Keys.DataVersion),
			"status"                : CJson.safeIntegerParse(response, CNetworkConst.Keys.Status),
			"tokenRegistTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenRegistTime),
			"tokenUpdateTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenUpdateTime),
			"tokenExpireTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenExpireTime),
			"results"               : CJson.safeObjectParse( response, CNetworkConst.Keys.ResultData)
		};
		return JSONData;
	}
}