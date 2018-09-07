"use strict";

import {CNetworkConst}        from "./CNetworkConst";
import {CJson}                from "../utils/CJson";

export namespace INetworkPacketWriter
{
	export interface Response
	{
		session: string;
		version: number;
		commandStatus: number;
		tokenRegistTime: number;
		tokenUpdateTime: number;
		tokenExpireTime: number;
		commandResult: object;
	}
}

export class CNetworkPacketWriter
{
	public static Request(response: Object): INetworkPacketWriter.Response
	{
		const JSONData: INetworkPacketWriter.Response = {
			"session"               : CJson.safeStringParse( response, CNetworkConst.Keys.Token),
			"version"               : CJson.safeIntegerParse(response, CNetworkConst.Keys.DataVersion),
			"commandStatus"         : CJson.safeIntegerParse(response, CNetworkConst.Keys.CommandStatus),
			"tokenRegistTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenRegistTime),
			"tokenUpdateTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenUpdateTime),
			"tokenExpireTime"       : CJson.safeIntegerParse(response, CNetworkConst.Keys.TokenExpireTime),
			"commandResult"         : CJson.safeObjectParse( response, CNetworkConst.Keys.CommandResult)
		};
		return JSONData;
	}
}