"use strict";

import {CLinkedList} from './CLinkedList';
import * as util     from './CUtil';

export class CStack<T>
{
	private m_list: CLinkedList<T>;

	constructor()
	{
		this.m_list = new CLinkedList<T>();
	}

	public push(elem: T)
	{
		return this.m_list.add(elem, 0);
	}

	public add(elem: T)
	{
		return this.m_list.add(elem, 0);
	}

	public pop(): T | undefined
	{
		return this.m_list.removeElementAtIndex(0);
	}

	public peek(): T | undefined
	{
		return this.m_list.first();
	}

	public size(): number
	{
		return this.m_list.size();
	}

	public contains(elem: T, equalsFunction?: util.IEqualsFunction<T>)
	{
		return this.m_list.contains(elem, equalsFunction);
	}

	public isEmpty(): boolean
	{
		return this.m_list.isEmpty();
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
