"use strict";

import {CQueue}          from "../structure/CQueue";
import {CDebug}          from "../CDebug";
import {IPoolAbleObject} from "./IPoolAbleObject";

export class CMemoryPool<T extends IPoolAbleObject>
{
	protected ms_pool: CQueue<T> = new CQueue<T>();

	protected m_allocCount: number = 0;

	constructor(protected m_instance: new () => T)
	{

	}

	/********************************************************************************************
	 * initialize
	 ********************************************************************************************/
	public cache(count: number): void
	{
		for (let idx: number = 0; idx < count; ++idx) {
			this.ms_pool.enqueue(this.alloc(true));
		}
	}

	/********************************************************************************************
	 * memory pool
	 ********************************************************************************************/
	public alloc(newAllocate: boolean = false): T
	{
		let allocObject: T;

		if (! newAllocate && this.ms_pool.size() !== 0) {
			allocObject = this.ms_pool.dequeue();
		}
		else {
			++this.m_allocCount;
			allocObject = new this.m_instance();
		}

		CDebug.logErrorFormat("alloc [%s]", this.m_instance.name);

		allocObject.onAlloc();

		return allocObject;
	}

	public free(freeObject: T): void
	{
		if (freeObject) {
			freeObject.onFree();
			this.ms_pool.enqueue(freeObject);
			this.debug(this.m_instance.name);
		}
	}

	public clear()
	{
		this.ms_pool.clear();
	}

	public debug(instanceName: string): void
	{
		CDebug.logErrorFormat("free  [%s]. 할당된 개수(%d), 반환된 개수(%d)", instanceName, this.m_allocCount, this.ms_pool.size());
	}
}