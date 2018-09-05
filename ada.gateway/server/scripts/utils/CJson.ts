"use strict";

import {CDebug} from "./CDebug";

export class CJson
{
    public static DEFAULT_ASSERTION: boolean = true;

    /********************************************************************************************
     * safe object
     ********************************************************************************************/
    public static safeIntegerParse(JSONValue: any, key: string, defaultValue: number = 0, assert: boolean = CJson.DEFAULT_ASSERTION): number
    {
        if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
            CDebug.logWarningFormat("JSONInteger Key Not Found(%s)", key);
            CDebug.assert(! assert, "JSONInteger Key Not Found(%s)", key);
            return defaultValue;
        }
        return Number(JSONValue[key]);
    }

    public static safeFloatParse(JSONValue: any, key: string, defaultValue: number = -0.1, assert = CJson.DEFAULT_ASSERTION): number
    {
	    if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
            CDebug.logWarningFormat("JSONFloat Key Not Found(%s)", key);
            CDebug.assert(! assert, "JSONFloat Key Not Found(%s)", key);
            return defaultValue;
        }
        return parseFloat(JSONValue[key]);
    }

    public static safeBooleanParse(JSONValue: any, key: string, defaultValue: boolean = false, assert: boolean = CJson.DEFAULT_ASSERTION): boolean
    {
        JSONValue[key] = JSONValue[key] === "true";

	    if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
            CDebug.logWarningFormat("JSONBoolean Key Not Found(%s)", key);
            CDebug.assert(! assert, "JSONBoolean Key Not Found(%s)", key);
            return defaultValue;
        }
        return Boolean(JSONValue[key]);
    }

    public static safeStringParse(JSONValue: any, key: string, defaultValue: string = "", assert: boolean = CJson.DEFAULT_ASSERTION): string
    {
	    if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
            CDebug.logWarningFormat("JSONString Key Not Found(%s)", key);
            CDebug.assert(!assert,  "JSONString Key Not Found(%s)", key);
            return defaultValue;
        }

        return String(JSONValue[key]);
    }

	public static safeObjectParse(JSONValue: any, key: string, defaultValue: object = {}, assert: boolean = CJson.DEFAULT_ASSERTION): object
	{
		if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
			CDebug.logWarningFormat("JSONObject Key Not Found(%s)", key);
			CDebug.assert(!assert,  "JSONObject Key Not Found(%s)", key);
			return null;
		}

		return JSONValue[key];
	}

	public static safeArrayParse(JSONValue: any, key: string, defaultValue: Array<any> = Array<any>(), assert: boolean = CJson.DEFAULT_ASSERTION): Array<any>
	{
		if (JSONValue === null || JSONValue === undefined || JSONValue[key] === null || JSONValue[key] === undefined) {
			CDebug.logWarningFormat("JSONArray Key Not Found(%s)", key);
			CDebug.assert(!assert,  "JSONArray Key Not Found(%s)", key);
			return null;
		}

		return JSONValue[key];
	}
}