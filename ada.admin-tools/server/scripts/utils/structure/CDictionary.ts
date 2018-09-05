"use strict";

import * as util from './CUtil';

export interface IDictionaryPair<K, V>
{
	key: K;
	value: V;
}

export class CDictionary<K, V>
{
	protected m_table: { [key: string]: IDictionaryPair<K, V> }; //: [key: K] will not work since indices can only by strings in javascript and typescript enforces this.

	protected m_nElements: number;

	protected m_toStr: (key: K) => string;

	constructor(toStrFunction?: (key: K) => string)
	{
		this.m_table = {};
		this.m_nElements = 0;
		this.m_toStr = toStrFunction || util.defaultToString;
	}

	public getValue(key: K): V | undefined
	{
		const pair: IDictionaryPair<K, V> = this.m_table['$' + this.m_toStr(key)];
		if (util.isUndefined(pair)) {
			return undefined;
		}
		return pair.value;
	}

	public setValue(key: K, value: V): V | undefined
	{

		if (util.isUndefined(key) || util.isUndefined(value)) {
			return undefined;
		}

		let ret: V | undefined;
		const k = '$' + this.m_toStr(key);
		const previousElement: IDictionaryPair<K, V> = this.m_table[k];
		if (util.isUndefined(previousElement)) {
			this.m_nElements++;
			ret = undefined;
		} else {
			ret = previousElement.value;
		}
		this.m_table[k] = {
			key: key,
			value: value
		};
		return ret;
	}

	public remove(key: K): V | undefined
	{
		const k = '$' + this.m_toStr(key);
		const previousElement: IDictionaryPair<K, V> = this.m_table[k];
		if (!util.isUndefined(previousElement)) {
			delete this.m_table[k];
			this.m_nElements--;
			return previousElement.value;
		}
		return undefined;
	}

	public keys(): K[]
	{
		const array: K[] = [];
		for (const name in this.m_table) {
			if (util.has(this.m_table, name)) {
				const pair: IDictionaryPair<K, V> = this.m_table[name];
				array.push(pair.key);
			}
		}
		return array;
	}

	public values(): V[]
	{
		const array: V[] = [];
		for (const name in this.m_table) {
			if (util.has(this.m_table, name)) {
				const pair: IDictionaryPair<K, V> = this.m_table[name];
				array.push(pair.value);
			}
		}
		return array;
	}

	public forEach(callback: (key: K, value: V) => any): void
	{
		for (const name in this.m_table) {
			if (util.has(this.m_table, name)) {
				const pair: IDictionaryPair<K, V> = this.m_table[name];
				const ret = callback(pair.key, pair.value);
				if (ret === false) {
					return;
				}
			}
		}
	}

	public containsKey(key: K): boolean
	{
		return !util.isUndefined(this.getValue(key));
	}

	public clear()
	{
		this.m_table = {};
		this.m_nElements = 0;
	}

	public size(): number
	{
		return this.m_nElements;
	}

	public isEmpty(): boolean
	{
		return this.m_nElements <= 0;
	}

	public toString(): string
	{
		let toret = '{';
		this.forEach((k, v) => {
			toret += `\n\t${k} : ${v}`;
		});
		return toret + '\n}';
	}
}
