"use strict";

import * as util from './CUtil';
import {CHeap}   from './CHeap';

export class CPriorityQueue<T>
{
	private m_heap: CHeap<T>;

	constructor(compareFunction?: util.ICompareFunction<T>)
	{
		this.m_heap = new CHeap<T>(util.reverseCompareFunction(compareFunction));
	}

	public enqueue(element: T): boolean
	{
		return this.m_heap.add(element);
	}

	public add(element: T): boolean
	{
		return this.m_heap.add(element);
	}

	public dequeue(): T | undefined
	{
		if (this.m_heap.size() !== 0) {
			const el = this.m_heap.peek();
			this.m_heap.removeRoot();
			return el;
		}
		return undefined;
	}

	public peek(): T | undefined
	{
		return this.m_heap.peek();
	}

	public contains(element: T): boolean
	{
		return this.m_heap.contains(element);
	}

	public isEmpty(): boolean
	{
		return this.m_heap.isEmpty();
	}

	public size(): number
	{
		return this.m_heap.size();
	}

	public clear(): void
	{
		this.m_heap.clear();
	}

	public forEach(callback: util.ILoopFunction<T>)
	{
		this.m_heap.forEach(callback);
	}

}
