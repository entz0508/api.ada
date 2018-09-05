"use strict";

import * as path     from "path";
import {CFileSystem} from "../filesystem/CFileSystem";

export class CFileUploader
{
	public static async ensureDirs(name: string, ...args: string[]): Promise<void>
	{
		const count: number = args.length;
		for (let idx: number = 0; idx < count; ++idx) {
			await CFileSystem.ensureDir(path.join(args[idx], name));
		}
	}

	public static removeFileExtension(filename: string): string
	{
		const filenameArr: string[] = filename.split(".");
		filenameArr.pop();
		return filenameArr.join("");
	}
}