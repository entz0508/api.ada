"use strict";

import * as util    from "util";
import * as fs      from "fs";
import * as fsExtra from "fs-extra";
import * as _       from "lodash";

const zip = require("zip-folder");

export class CFileSystem
{
	public static async copy(src: string, dest: string, options?: fsExtra.CopyOptions): Promise<void>
	{
		await fsExtra.copy(src, dest, options);
	}

	public static async move(src: string, dest: string, options?: fsExtra.MoveOptions): Promise<void>
	{
		await fsExtra.move(src, dest, options);
	}

	public static async remove(dir: string): Promise<void>
	{
		await fsExtra.remove(dir);
	}

	public static async ensureDir(path: string): Promise<void>
	{
		await fsExtra.ensureDir(path);
	}

	public static async createJSONFile(path: fs.PathLike, JSONData: string | object, options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | null): Promise<any>
	{
		if (_.isString(JSONData)) {
			JSONData = JSON.stringify(JSONData);
		}

		// await util.promisify(fs.writeFile(path + ".json", JSONData, options));

		return new Promise((resolve: () => void, reject: (exception: any) => void) => {
			fs.writeFile(path, JSON.stringify(JSONData), options, (error) => {
				if (error) {
					return reject(error);
				}
				resolve();
			});
		});
	}

	public static async streamJSONFile(srcFolder: string, zipFilePath: string): Promise<void>
	{
		const zipAsync = util.promisify(zip);
		await zipAsync(srcFolder, zipFilePath + ".zip");
	}
}