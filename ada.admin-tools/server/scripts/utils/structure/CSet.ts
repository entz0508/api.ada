"use strict";

import * as util     from './CUtil';
import * as arrays   from './CArrays';
import {CDictionary} from './CDictionary';

export class CSet<T>
{
	protected m_dictionary: CDictionary<T, any>;

	constructor(toStringFunction?: (item: T) => string)
	{
		this.m_dictionary = new CDictionary<T, any>(toStringFunction);
	}

	public contains(element: T): boolean
	{
		return this.m_dictionary.containsKey(element);
	}

	public add(element: T): boolean
	{
		if (this.contains(element) || util.isUndefined(element)) {
			return false;
		} else {
			this.m_dictionary.setValue(element, element);
			return true;
		}
	}

	public intersection(otherSet: CSet<T>): void
	{
		const set = this;
		this.forEach(function (element: T): boolean {
			if (!otherSet.contains(element)) {
				set.remove(element);
			}
			return true;
		});
	}

	public union(otherSet: Set<T>): void
	{
		const set = this;
		otherSet.forEach(function (element: T): boolean {
			set.add(element);
			return true;
		});
	}

	public difference(otherSet: CSet<T>): void
	{
		const set = this;
		otherSet.forEach(function (element: T): boolean {
			set.remove(element);
			return true;
		});
	}

	public isSubsetOf(otherSet: CSet<T>): boolean
	{

		if (this.size() > otherSet.size()) {
			return false;
		}

		let isSub = true;
		this.forEach(function (element) {
			if (!otherSet.contains(element)) {
				isSub = false;
				return false;
			}
			return true;
		});
		return isSub;
	}

	public remove(element: T): boolean
	{
		if (!this.contains(element)) {
			return false;
		} else {
			this.m_dictionary.remove(element);
			return true;
		}
	}

	public forEach(callback: util.ILoopFunction<T>): void
	{
		this.m_dictionary.forEach(function (k, v) {
			return callback(v);
		});
	}

	public toArray(): T[]
	{
		return this.m_dictionary.values();
	}

	public isEmpty(): boolean
	{
		return this.m_dictionary.isEmpty();
	}

	public size(): number
	{
		return this.m_dictionary.size();
	}

	public clear(): void
	{
		this.m_dictionary.clear();
	}

	public toString(): string
	{
		return arrays.toString(this.toArray());
	}
}
