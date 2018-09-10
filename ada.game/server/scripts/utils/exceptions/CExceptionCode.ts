"use strict";

export class CExceptionCode
{
	public static ErrorCode = class
	{
		public static Success: number   = 0;
		public static Failed: number    = 1;
		public static FailedDB: number  = 100;
	};
}