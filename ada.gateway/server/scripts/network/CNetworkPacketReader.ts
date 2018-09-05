"use strict";

import {CJson}         from "../utils/CJson";
import {CNetworkConst} from "./CNetworkConst";

export namespace INetworkPacketReader
{
	export interface Request
	{
		session: string;
		version: number;
		commands: object;
	}
}

export class CNetworkPacketReader
{
	public static Request(request: Object): INetworkPacketReader.Request
	{
		const JSONData: INetworkPacketReader.Request = {
			"session"   : CJson.safeStringParse( request, CNetworkConst.Keys.Session),
			"version"   : CJson.safeIntegerParse(request, CNetworkConst.Keys.DataVersion),
			"commands"  : CJson.safeObjectParse( request, CNetworkConst.Keys.Commands)
		};
		return JSONData;
	}
}