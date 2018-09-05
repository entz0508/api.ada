"use strict";

import * as util     from './CUtil';
import * as arrays   from './CArrays';
import {CDictionary} from './CDictionary';

export class CMultiDictionary<K, V>
{
	private m_dict: CDictionary<K, Array<V>>;

	private m_equalsF: util.IEqualsFunction<V>;

	private m_allowDuplicate: boolean;

	constructor(toStrFunction?: (key: K) => string, valuesEqualsFunction?: util.IEqualsFunction<V>, allowDuplicateValues = false)
	{
		this.m_dict = new CDictionary<K, Array<V>>(toStrFunction);
		this.m_equalsF = valuesEqualsFunction || util.defaultEquals;
		this.m_allowDuplicate = allowDuplicateValues;
	}

	public getValue(key: K): V[]
	{
		const values = this.m_dict.getValue(key);
		if (util.isUndefined(values)) {
			return [];
		}
		return arrays.copy(values);
	}

	public setValue(key: K, value: V): boolean
	{

		if (util.isUndefined(key) || util.isUndefined(value)) {
			return false;
		}
		const array = this.m_dict.getValue(key);
		if (util.isUndefined(array)) {
			this.m_dict.setValue(key, [value]);
			return true;
		}
		if (!this.m_allowDuplicate) {
			if (arrays.contains(array, value, this.m_equalsF)) {
				return false;
			}
		}
		array.push(value);
		return true;
	}

	public remove(key: K, value?: V): boolean
	{
		if (util.isUndefined(value)) {
			const v = this.m_dict.remove(key);
			return !util.isUndefined(v);
		}
		const array = this.m_dict.getValue(key);
		if (!util.isUndefined(array) && arrays.remove(array, value, this.m_equalsF)) {
			if (array.length === 0) {
				this.m_dict.remove(key);
			}
			return true;
		}
		return false;
	}

	public keys(): K[]
	{
		return this.m_dict.keys();
	}

	public values(): V[]
	{
		const values = this.m_dict.values();
		const array: Array<V> = [];
		for (const v of values) {
			for (const w of v) {
				array.push(w);
			}
		}
		return array;
	}

	public containsKey(key: K): boolean
	{
		return this.m_dict.containsKey(key);
	}

	public clear(): void
	{
		this.m_dict.clear();
	}

	public size(): number
	{
		return this.m_dict.size();
	}

	public isEmpty(): boolean
	{
		return this.m_dict.isEmpty();
	}
}
