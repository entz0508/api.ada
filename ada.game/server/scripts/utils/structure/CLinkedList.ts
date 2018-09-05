"use strict";

import * as util   from './CUtil';
import * as arrays from './CArrays';

export interface NxILinkedListNode<T>
{
	element: T;
	next: NxILinkedListNode<T> | null;
}

export class CLinkedList<T>
{
	private m_firstNode: NxILinkedListNode<T> | null = null;

	private m_lastNode: NxILinkedListNode<T> | null = null;

	private m_nElements: number = 0;

	constructor()
	{

	}

	public add(item: T, index?: number): boolean
	{
		if (util.isUndefined(index)) {
			index = this.m_nElements;
		}

		if (index < 0 || index > this.m_nElements || util.isUndefined(item)) {
			return false;
		}

		const newNode = this.createNode(item);
		if (this.m_nElements === 0 || this.m_lastNode === null) {
			// First node in the list.
			this.m_firstNode = newNode;
			this.m_lastNode = newNode;
		}
		else if (index === this.m_nElements) {
			// Insert at the end.
			this.m_lastNode.next = newNode;
			this.m_lastNode = newNode;
		}
		else if (index === 0) {
			// Change first node.
			newNode.next = this.m_firstNode;
			this.m_firstNode = newNode;
		}
		else {
			const prev = this.nodeAtIndex(index - 1);
			if (prev == null) {
				return false;
			}
			newNode.next = prev.next;
			prev.next = newNode;
		}

		this.m_nElements++;

		return true;
	}

	public first(): T | undefined
	{
		if (this.m_firstNode !== null) {
			return this.m_firstNode.element;
		}
		return undefined;
	}

	public last(): T | undefined
	{
		if (this.m_lastNode !== null) {
			return this.m_lastNode.element;
		}
		return undefined;
	}

	public elementAtIndex(index: number): T | undefined
	{
		const node = this.nodeAtIndex(index);
		if (node === null) {
			return undefined;
		}
		return node.element;
	}

	public indexOf(item: T, equalsFunction?: util.IEqualsFunction<T>): number
	{

		const equalsF = equalsFunction || util.defaultEquals;
		if (util.isUndefined(item)) {
			return -1;
		}
		let currentNode = this.m_firstNode;
		let index = 0;
		while (currentNode !== null) {
			if (equalsF(currentNode.element, item)) {
				return index;
			}
			index++;
			currentNode = currentNode.next;
		}
		return -1;
	}

	public contains(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean
	{
		return (this.indexOf(item, equalsFunction) >= 0);
	}

	public remove(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean
	{
		const equalsF = equalsFunction || util.defaultEquals;
		if (this.m_nElements < 1 || util.isUndefined(item)) {
			return false;
		}
		let previous: NxILinkedListNode<T> | null = null;
		let currentNode: NxILinkedListNode<T> | null = this.m_firstNode;

		while (currentNode !== null) {
			if (equalsF(currentNode.element, item)) {

				if (previous == null) { // currentNode is the first node
					this.m_firstNode = currentNode.next;
					if (currentNode === this.m_lastNode) {
						this.m_lastNode = null;
					}
				}
				else if (currentNode === this.m_lastNode) {
					this.m_lastNode = previous;
					previous.next = currentNode.next;
					currentNode.next = null;
				}
				else {
					previous.next = currentNode.next;
					currentNode.next = null;
				}

				this.m_nElements--;
				return true;
			}
			previous = currentNode;
			currentNode = currentNode.next;
		}
		return false;
	}

	public clear(): void
	{
		this.m_firstNode = null;
		this.m_lastNode = null;
		this.m_nElements = 0;
	}

	public equals(other: any, equalsFunction?: util.IEqualsFunction<T>): boolean
	{
		const eqF = equalsFunction || util.defaultEquals;
		if (!(other instanceof CLinkedList)) {
			return false;
		}
		if (this.size() !== other.size()) {
			return false;
		}
		return this.equalsAux(this.m_firstNode, other.m_firstNode, eqF);
	}

	private equalsAux(n1: NxILinkedListNode<T> | null, n2: NxILinkedListNode<T> | null, eqF: util.IEqualsFunction<T>): boolean
	{
		while (n1 !== null && n2 !== null) {
			if (!eqF(n1.element, n2.element)) {
				return false;
			}
			n1 = n1.next;
			n2 = n2.next;
		}
		return true;
	}

	public removeElementAtIndex(index: number): T | undefined
	{
		if (index < 0 || index >= this.m_nElements || this.m_firstNode === null || this.m_lastNode === null) {
			return undefined;
		}
		let element: T | undefined;
		if (this.m_nElements === 1) {
			//First node in the list.
			element = this.m_firstNode.element;
			this.m_firstNode = null;
			this.m_lastNode = null;
		} else {
			const previous = this.nodeAtIndex(index - 1);
			if (previous === null) {
				element = this.m_firstNode.element;
				this.m_firstNode = this.m_firstNode.next;
			} else if (previous.next === this.m_lastNode) {
				element = this.m_lastNode.element;
				this.m_lastNode = previous;
			}
			if (previous !== null && previous.next !== null) {
				element = previous.next.element;
				previous.next = previous.next.next;
			}
		}
		this.m_nElements--;
		return element;
	}

	public forEach(callback: util.ILoopFunction<T>): void
	{
		let currentNode = this.m_firstNode;
		while (currentNode !== null) {
			if (callback(currentNode.element) === false) {
				break;
			}
			currentNode = currentNode.next;
		}
	}

	public reverse(): void
	{
		let previous: NxILinkedListNode<T> | null = null;
		let current: NxILinkedListNode<T> | null = this.m_firstNode;
		let temp: NxILinkedListNode<T> | null = null;
		while (current !== null) {
			temp = current.next;
			current.next = previous;
			previous = current;
			current = temp;
		}
		temp = this.m_firstNode;
		this.m_firstNode = this.m_lastNode;
		this.m_lastNode = temp;
	}

	public toArray(): T[]
	{
		const array: T[] = [];
		let currentNode: NxILinkedListNode<T> | null = this.m_firstNode;
		while (currentNode !== null) {
			array.push(currentNode.element);
			currentNode = currentNode.next;
		}
		return array;
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
		return arrays.toString(this.toArray());
	}

	private nodeAtIndex(index: number): NxILinkedListNode<T> | null
	{

		if (index < 0 || index >= this.m_nElements) {
			return null;
		}
		if (index === (this.m_nElements - 1)) {
			return this.m_lastNode;
		}
		let node = this.m_firstNode;
		for (let i = 0; i < index && node != null; i++) {
			node = node.next;
		}
		return node;
	}

	private createNode(item: T): NxILinkedListNode<T>
	{
		return {
			element: item,
			next: null
		};
	}
}
