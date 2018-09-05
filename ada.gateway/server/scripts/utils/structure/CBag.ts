"use strict";

import * as util     from './CUtil';
import {CDictionary} from './CDictionary';
import {CSet}        from './CSet';

export class CBag<T>
{
	private m_toStrF: (item: T) => string;
	private m_dictionary: CDictionary<T, any>;
	private m_nElements: number;

	constructor(toStrFunction?: (item: T) => string)
	{
		this.m_toStrF = toStrFunction || util.defaultToString;
		this.m_dictionary = new CDictionary<T, any>(this.m_toStrF);
		this.m_nElements = 0;
	}

	public add(element: T, nCopies: number = 1): boolean
	{

		if (util.isUndefined(element) || nCopies <= 0) {
			return false;
		}

		if (!this.contains(element)) {
			const node = {
				value: element,
				copies: nCopies
			};
			this.m_dictionary.setValue(element, node);
		} else {
			this.m_dictionary.getValue(element).copies += nCopies;
		}
		this.m_nElements += nCopies;
		return true;
	}

	public count(element: T): number
	{

		if (!this.contains(element)) {
			return 0;
		} else {
			return this.m_dictionary.getValue(element).copies;
		}
	}

	public contains(element: T): boolean
	{
		return this.m_dictionary.containsKey(element);
	}

	public remove(element: T, nCopies: number = 1)
	{

		if (util.isUndefined(element) || nCopies <= 0) {
			return false;
		}

		if (!this.contains(element)) {
			return false;
		}
		else {
			const node = this.m_dictionary.getValue(element);
			if (nCopies > node.copies) {
				this.m_nElements -= node.copies;
			}
			else {
				this.m_nElements -= nCopies;
			}
			node.copies -= nCopies;
			if (node.copies <= 0) {
				this.m_dictionary.remove(element);
			}
			return true;
		}
	}

	public toArray(): T[]
	{
		const a: Array<T> = [];
		const values = this.m_dictionary.values();
		for (const node of values) {
			const element = node.value;
			const copies = node.copies;
			for (let j = 0; j < copies; j++) {
				a.push(element);
			}
		}
		return a;
	}

	public toSet(): CSet<T>
	{
		const toret = new CSet<T>(this.m_toStrF);
		const elements = this.m_dictionary.values();
		for (const ele of elements) {
			const value = ele.value;
			toret.add(value);
		}
		return toret;
	}

	public forEach(callback: util.ILoopFunction<T>)
	{
		this.m_dictionary.forEach(function (k, v) {
			const value = v.value;
			const copies = v.copies;
			for (let i = 0; i < copies; i++) {
				if (callback(value) === false) {
					return false;
				}
			}
			return true;
		});
	}

	public size(): number
	{
		return this.m_nElements;
	}

	public isEmpty(): boolean
	{
		return this.m_nElements === 0;
	}

	public clear(): void
	{
		this.m_nElements = 0;
		this.m_dictionary.clear();
	}
}
