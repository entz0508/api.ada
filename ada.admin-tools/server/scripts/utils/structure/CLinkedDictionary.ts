"use strict";

import {IDictionaryPair, CDictionary} from './CDictionary';
import * as util                      from './CUtil';

class NxLinkedDictionaryPair<K, V> implements IDictionaryPair<K, V>
{
	prev: NxLinkedDictionaryPair<K, V> | HeadOrTailLinkedDictionaryPair<K, V>;
	next: NxLinkedDictionaryPair<K, V> | HeadOrTailLinkedDictionaryPair<K, V>;

	constructor(public key: K, public value: V)
	{
	}

	public unlink(): void
	{
		this.prev.next = this.next;
		this.next.prev = this.prev;
	}
}

class HeadOrTailLinkedDictionaryPair<K, V> implements IDictionaryPair<null, null>
{
	prev: NxLinkedDictionaryPair<K, V> | HeadOrTailLinkedDictionaryPair<K, V>;
	next: NxLinkedDictionaryPair<K, V> | HeadOrTailLinkedDictionaryPair<K, V>;
	key: null = null;
	value: null = null;

	public unlink(): void
	{
		this.prev.next = this.next;
		this.next.prev = this.prev;
	}
}

function isHeadOrTailLinkedDictionaryPair<K, V>(p: HeadOrTailLinkedDictionaryPair<K, V> | NxLinkedDictionaryPair<K, V>): p is HeadOrTailLinkedDictionaryPair<K, V>
{
	return p.next === null;
}

export class LinkedDictionary<K, V> extends CDictionary<K, V>
{
	private m_head: HeadOrTailLinkedDictionaryPair<K, V>; // Head Identifier of the list.  holds no Key or Value
	private m_tail: HeadOrTailLinkedDictionaryPair<K, V>; // Tail Identifier of the list.  holds no Key or Value

	constructor(toStrFunction?: (key: K) => string)
	{
		super(toStrFunction);
		this.m_head = new HeadOrTailLinkedDictionaryPair();
		this.m_tail = new HeadOrTailLinkedDictionaryPair();
		this.m_head.next = this.m_tail;
		this.m_tail.prev = this.m_head;
	}

	private appendToTail(entry: NxLinkedDictionaryPair<K, V>): void
	{
		const lastNode = this.m_tail.prev;
		lastNode.next = entry;
		entry.prev = lastNode;
		entry.next = this.m_tail;
		this.m_tail.prev = entry;
	}

	private getLinkedDictionaryPair(key: K): NxLinkedDictionaryPair<K, V> | undefined
	{
		if (util.isUndefined(key)) {
			return undefined;
		}
		const k = '$' + this.m_toStr(key);
		const pair = <NxLinkedDictionaryPair<K, V>>(this.m_table[k]);
		return pair;
	}

	public getValue(key: K): V | undefined
	{
		const pair = this.getLinkedDictionaryPair(key);
		if (!util.isUndefined(pair)) {
			return pair.value;
		}
		return undefined;
	}

	public remove(key: K): V | undefined
	{
		const pair = this.getLinkedDictionaryPair(key);
		if (!util.isUndefined(pair)) {
			super.remove(key);  // This will remove it from the table
			pair.unlink();      // This will unlink it from the chain
			return pair.value;
		}
		return undefined;
	}

	public clear(): void
	{
		super.clear();
		this.m_head.next = this.m_tail;
		this.m_tail.prev = this.m_head;
	}

	private replace(oldPair: NxLinkedDictionaryPair<K, V>, newPair: NxLinkedDictionaryPair<K, V>): void
	{
		const k = '$' + this.m_toStr(newPair.key);

		// set the new Pair's links to existingPair's links
		newPair.next = oldPair.next;
		newPair.prev = oldPair.prev;

		// Delete Existing Pair from the table, unlink it from chain.
		// As a result, the nElements gets decremented by this operation
		this.remove(oldPair.key);

		// Link new Pair in place of where oldPair was,
		// by pointing the old pair's neighbors to it.
		newPair.prev.next = newPair;
		newPair.next.prev = newPair;

		this.m_table[k] = newPair;

		// To make up for the fact that the number of elements was decremented,
		// We need to increase it by one.
		++this.m_nElements;
	}

	public setValue(key: K, value: V): V | undefined
	{

		if (util.isUndefined(key) || util.isUndefined(value)) {
			return undefined;
		}

		const existingPair = this.getLinkedDictionaryPair(key);
		const newPair = new NxLinkedDictionaryPair<K, V>(key, value);

		const k = '$' + this.m_toStr(key);

		// If there is already an element for that key, we
		// keep it's place in the LinkedList
		if (!util.isUndefined(existingPair)) {
			this.replace(existingPair, newPair);

			return existingPair.value;
		} else {
			this.appendToTail(newPair);
			this.m_table[k] = newPair;
			++this.m_nElements;

			return undefined;
		}

	}

	public keys(): K[]
	{
		const array: K[] = [];
		this.forEach((key, value) => {
			array.push(key);
		});
		return array;
	}

	public values(): V[]
	{
		const array: V[] = [];
		this.forEach((key, value) => {
			array.push(value);
		});
		return array;
	}

	public forEach(callback: (key: K, value: V) => any): void
	{
		let crawlNode = this.m_head.next;
		while (!isHeadOrTailLinkedDictionaryPair(crawlNode)) {
			const ret = callback(crawlNode.key, crawlNode.value);
			if (ret === false) {
				return;
			}
			crawlNode = crawlNode.next;
		}
	}
}