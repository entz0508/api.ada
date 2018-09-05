"use strict";

import * as collections from './CUtil';
import * as arrays      from './CArrays';

export class CHeap<T>
{
	private m_data: T[] = [];

	private compare: collections.ICompareFunction<T>;

	constructor(compareFunction?: collections.ICompareFunction<T>)
	{
		this.compare = compareFunction || collections.defaultCompare;
	}

	private leftChildIndex(nodeIndex: number): number
	{
		return (2 * nodeIndex) + 1;
	}

	private rightChildIndex(nodeIndex: number): number
	{
		return (2 * nodeIndex) + 2;
	}

	private parentIndex(nodeIndex: number): number
	{
		return Math.floor((nodeIndex - 1) / 2);
	}

	private minIndex(leftChild: number, rightChild: number): number
	{

		if (rightChild >= this.m_data.length) {
			if (leftChild >= this.m_data.length) {
				return -1;
			} else {
				return leftChild;
			}
		} else {
			if (this.compare(this.m_data[leftChild], this.m_data[rightChild]) <= 0) {
				return leftChild;
			} else {
				return rightChild;
			}
		}
	}

	private siftUp(index: number): void
	{

		let parent = this.parentIndex(index);
		while (index > 0 && this.compare(this.m_data[parent], this.m_data[index]) > 0) {
			arrays.swap(this.m_data, parent, index);
			index = parent;
			parent = this.parentIndex(index);
		}
	}

	private siftDown(nodeIndex: number): void
	{

		//smaller child index
		let min = this.minIndex(this.leftChildIndex(nodeIndex),
			this.rightChildIndex(nodeIndex));

		while (min >= 0 && this.compare(this.m_data[nodeIndex],
			this.m_data[min]) > 0) {
			arrays.swap(this.m_data, min, nodeIndex);
			nodeIndex = min;
			min = this.minIndex(this.leftChildIndex(nodeIndex),
				this.rightChildIndex(nodeIndex));
		}
	}

	public peek(): T | undefined
	{

		if (this.m_data.length > 0) {
			return this.m_data[0];
		} else {
			return undefined;
		}
	}

	public add(element: T): boolean
	{
		if (collections.isUndefined(element)) {
			return false;
		}
		this.m_data.push(element);
		this.siftUp(this.m_data.length - 1);
		return true;
	}

	public removeRoot(): T | undefined
	{

		if (this.m_data.length > 0) {
			const obj = this.m_data[0];
			this.m_data[0] = this.m_data[this.m_data.length - 1];
			this.m_data.splice(this.m_data.length - 1, 1);
			if (this.m_data.length > 0) {
				this.siftDown(0);
			}
			return obj;
		}
		return undefined;
	}

	public contains(element: T): boolean
	{
		const equF = collections.compareToEquals(this.compare);
		return arrays.contains(this.m_data, element, equF);
	}

	public size(): number
	{
		return this.m_data.length;
	}

	public isEmpty(): boolean
	{
		return this.m_data.length <= 0;
	}

	public clear(): void
	{
		this.m_data.length = 0;
	}

	public forEach(callback: collections.ILoopFunction<T>): void
	{
		arrays.forEach(this.m_data, callback);
	}
}
