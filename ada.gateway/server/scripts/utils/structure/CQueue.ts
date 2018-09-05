"use strict";

import * as util     from './CUtil';
import {CLinkedList} from './CLinkedList';

export class CQueue<T>
{
	private m_list: CLinkedList<T>;

	constructor()
	{
		this.m_list = new CLinkedList<T>();
	}

	public enqueue(elem: T): boolean
	{
		return this.m_list.add(elem);
	}

	public add(elem: T): boolean
	{
		return this.m_list.add(elem);
	}

	public dequeue(): T | undefined
	{
		if (this.m_list.size() !== 0) {
			const el = this.m_list.first();
			this.m_list.removeElementAtIndex(0);
			return el;
		}
		return undefined;
	}

	public peek(): T | undefined
	{

		if (this.m_list.size() !== 0) {
			return this.m_list.first();
		}
		return undefined;
	}

	public size(): number
	{
		return this.m_list.size();
	}

	public contains(elem: T, equalsFunction?: util.IEqualsFunction<T>): boolean
	{
		return this.m_list.contains(elem, equalsFunction);
	}

	public isEmpty(): boolean
	{
		return this.m_list.size() <= 0;
	}

	public clear(): void
	{
		this.m_list.clear();
	}

	public forEach(callback: util.ILoopFunction<T>)
	{
		this.m_list.forEach(callback);
	}
}
