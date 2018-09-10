"use strict";

import * as util from './CUtil';
import {CQueue}  from './CQueue';

interface BSTreeNode<T>
{
	element: T;
	leftCh: BSTreeNode<T> | null;
	rightCh: BSTreeNode<T> | null;
	parent: BSTreeNode<T> | null;
}

export class CBSTreeKV<K, V extends K>
{

	private m_root: BSTreeNode<V> | null;
	private m_compare: util.ICompareFunction<K>;
	private m_nElements: number;

	constructor(compareFunction?: util.ICompareFunction<K>)
	{
		this.m_root = null;
		this.m_compare = compareFunction || util.defaultCompare;
		this.m_nElements = 0;
	}

	public add(element: V): boolean
	{
		if (util.isUndefined(element)) {
			return false;
		}

		if (this.insertNode(this.createNode(element)) !== null) {
			this.m_nElements++;
			return true;
		}
		return false;
	}

	public clear(): void
	{
		this.m_root = null;
		this.m_nElements = 0;
	}

	public isEmpty(): boolean
	{
		return this.m_nElements === 0;
	}

	public size(): number
	{
		return this.m_nElements;
	}

	public contains(element: K): boolean
	{
		if (util.isUndefined(element)) {
			return false;
		}
		return this.searchNode(this.m_root, element) !== null;
	}

	public search(element: K): V | undefined
	{
		const ret = this.searchNode(this.m_root, element);
		if (ret === null) {
			return undefined;
		}
		return ret.element;
	}

	public remove(element: K): boolean
	{
		const node = this.searchNode(this.m_root, element);
		if (node === null) {
			return false;
		}
		this.removeNode(node);
		this.m_nElements--;
		return true;
	}

	public inorderTraversal(callback: util.ILoopFunction<V>): void
	{
		this.inorderTraversalAux(this.m_root, callback, {
			stop: false
		});
	}

	public preorderTraversal(callback: util.ILoopFunction<V>): void
	{
		this.preorderTraversalAux(this.m_root, callback, {
			stop: false
		});
	}

	public postorderTraversal(callback: util.ILoopFunction<V>): void
	{
		this.postorderTraversalAux(this.m_root, callback, {
			stop: false
		});
	}

	public levelTraversal(callback: util.ILoopFunction<V>): void
	{
		this.levelTraversalAux(this.m_root, callback);
	}

	public minimum(): V | undefined
	{
		if (this.isEmpty() || this.m_root === null) {
			return undefined;
		}
		return this.minimumAux(this.m_root).element;
	}

	public maximum(): V | undefined
	{
		if (this.isEmpty() || this.m_root === null) {
			return undefined;
		}
		return this.maximumAux(this.m_root).element;
	}

	public forEach(callback: util.ILoopFunction<V>): void
	{
		this.inorderTraversal(callback);
	}

	public toArray(): V[]
	{
		const array: V[] = [];
		this.inorderTraversal(function (element: V): boolean {
			array.push(element);
			return true;
		});
		return array;
	}

	public height(): number
	{
		return this.heightAux(this.m_root);
	}

	private searchNode(node: BSTreeNode<V> | null, element: K): BSTreeNode<V> | null
	{
		let cmp: number = 1;
		while (node !== null && cmp !== 0) {
			cmp = this.m_compare(element, node.element);
			if (cmp < 0) {
				node = node.leftCh;
			} else if (cmp > 0) {
				node = node.rightCh;
			}
		}
		return node;
	}

	private transplant(n1: BSTreeNode<V>, n2: BSTreeNode<V> | null): void
	{
		if (n1.parent === null) {
			this.m_root = n2;
		} else if (n1 === n1.parent.leftCh) {
			n1.parent.leftCh = n2;
		} else {
			n1.parent.rightCh = n2;
		}
		if (n2 !== null) {
			n2.parent = n1.parent;
		}
	}

	private removeNode(node: BSTreeNode<V>): void
	{
		if (node.leftCh === null) {
			this.transplant(node, node.rightCh);
		} else if (node.rightCh === null) {
			this.transplant(node, node.leftCh);
		} else {
			const y = this.minimumAux(node.rightCh);
			if (y.parent !== node) {
				this.transplant(y, y.rightCh);
				y.rightCh = node.rightCh;
				y.rightCh.parent = y;
			}
			this.transplant(node, y);
			y.leftCh = node.leftCh;
			y.leftCh.parent = y;
		}
	}

	private inorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; }): void
	{
		if (node === null || signal.stop) {
			return;
		}
		this.inorderTraversalAux(node.leftCh, callback, signal);
		if (signal.stop) {
			return;
		}
		signal.stop = callback(node.element) === false;
		if (signal.stop) {
			return;
		}
		this.inorderTraversalAux(node.rightCh, callback, signal);
	}

	private levelTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>)
	{
		const queue = new CQueue<BSTreeNode<V>>();
		if (node !== null) {
			queue.enqueue(node);
		}
		node = queue.dequeue() || null;
		while (node !== null) {
			if (callback(node.element) === false) {
				return;
			}
			if (node.leftCh !== null) {
				queue.enqueue(node.leftCh);
			}
			if (node.rightCh !== null) {
				queue.enqueue(node.rightCh);
			}
			node = queue.dequeue() || null;
		}
	}

	private preorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; })
	{
		if (node === null || signal.stop) {
			return;
		}
		signal.stop = callback(node.element) === false;
		if (signal.stop) {
			return;
		}
		this.preorderTraversalAux(node.leftCh, callback, signal);
		if (signal.stop) {
			return;
		}
		this.preorderTraversalAux(node.rightCh, callback, signal);
	}

	private postorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; })
	{
		if (node === null || signal.stop) {
			return;
		}
		this.postorderTraversalAux(node.leftCh, callback, signal);
		if (signal.stop) {
			return;
		}
		this.postorderTraversalAux(node.rightCh, callback, signal);
		if (signal.stop) {
			return;
		}
		signal.stop = callback(node.element) === false;
	}

	private minimumAux(node: BSTreeNode<V>): BSTreeNode<V>;
	private minimumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null;
	private minimumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null
	{
		while (node !== null && node.leftCh !== null) {
			node = node.leftCh;
		}
		return node;
	}

	private maximumAux(node: BSTreeNode<V>): BSTreeNode<V>;
	private maximumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null;
	private maximumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null
	{
		while (node !== null && node.rightCh !== null) {
			node = node.rightCh;
		}
		return node;
	}

	private heightAux(node: BSTreeNode<V> | null): number
	{
		if (node === null) {
			return -1;
		}
		return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
	}

	private insertNode(node: BSTreeNode<V>): BSTreeNode<V> | null
	{

		let parent: any = null;
		let position = this.m_root;
		while (position !== null) {
			const cmp = this.m_compare(node.element, position.element);
			if (cmp === 0) {
				return null;
			} else if (cmp < 0) {
				parent = position;
				position = position.leftCh;
			} else {
				parent = position;
				position = position.rightCh;
			}
		}
		node.parent = parent;
		if (parent === null) {
			// tree is empty
			this.m_root = node;
		} else if (this.m_compare(node.element, parent.element) < 0) {
			parent.leftCh = node;
		} else {
			parent.rightCh = node;
		}
		return node;
	}

	private createNode(element: V): BSTreeNode<V>
	{
		return {
			element: element,
			leftCh: null,
			rightCh: null,
			parent: null
		};
	}
}
