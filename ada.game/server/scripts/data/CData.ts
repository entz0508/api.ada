"use strict";

import {CPartsItemXlsTblAssetDao} from "./dao/CPartsItemXlsTblAssetDao";
import {PartsItemXls}             from "./entity/PartsItemXls_Parser";
import {CDebug}                   from "../utils/CDebug";

export class CData
{
	protected static m_partsItemXlsTblAsset: Map<number, PartsItemXls> = new Map<number, PartsItemXls>();

	public static async load(version: number): Promise<boolean>
	{
		return true; // 임시

		if (! this.loadPartsItemXlsTblAssetData(await CPartsItemXlsTblAssetDao.getDataList(version))) {
			CDebug.logWarningFormat("Failed. [Nx.%s] load", "PartsItemXlsTblAsset");
			return false;
		}
		return true;
	}

	/********************************************************************************************
	 * item.parts
	 ********************************************************************************************/
	protected static unloadPartsItemXlsTblAssetData()
	{
		this.m_partsItemXlsTblAsset = new Map<number, PartsItemXls>();
	}

	protected static loadPartsItemXlsTblAssetData(data: Map<number, PartsItemXls>): boolean
	{
		this.unloadPartsItemXlsTblAssetData();

		if (data.size < 1) {
			return false;
		}

		this.m_partsItemXlsTblAsset = data;
		return true;
	}

	public static getPartsItemXlsTblAssetDataBy(uuid: number): PartsItemXls
	{
		return this.m_partsItemXlsTblAsset.get(uuid);
	}
}