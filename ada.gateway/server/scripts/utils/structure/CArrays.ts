"use strict";

import * as util from './CUtil';

export function indexOf<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number
{
	const equals = equalsFunction || util.defaultEquals;
	const length = array.length;
	for (let i = 0; i < length; i++) {
		if (equals(array[i], item)) {
			return i;
		}
	}
	return -1;
}

export function lastIndexOf<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number
{
	const equals = equalsFunction || util.defaultEquals;
	const length = array.length;
	for (let i = length - 1; i >= 0; i--) {
		if (equals(array[i], item)) {
			return i;
		}
	}
	return -1;
}

export function contains<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): boolean
{
	return indexOf(array, item, equalsFunction) >= 0;
}

export function remove<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): boolean
{
	const index = indexOf(array, item, equalsFunction);
	if (index < 0) {
		return false;
	}
	array.splice(index, 1);
	return true;
}

export function frequency<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number
{
	const equals = equalsFunction || util.defaultEquals;
	const length = array.length;
	let freq = 0;
	for (let i = 0; i < length; i++) {
		if (equals(array[i], item)) {
			freq++;
		}
	}
	return freq;
}

export function equals<T>(array1: T[], array2: T[], equalsFunction?: util.IEqualsFunction<T>): boolean
{
	const equals = equalsFunction || util.defaultEquals;

	if (array1.length !== array2.length) {
		return false;
	}
	const length = array1.length;
	for (let i = 0; i < length; i++) {
		if (!equals(array1[i], array2[i])) {
			return false;
		}
	}
	return true;
}

export function copy<T>(array: T[]): T[]
{
	return array.concat();
}

export function swap<T>(array: T[], i: number, j: number): boolean
{
	if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
		return false;
	}
	const temp = array[i];
	array[i] = array[j];
	array[j] = temp;
	return true;
}

export function toString<T>(array: T[]): string
{
	return '[' + array.toString() + ']';
}

export function forEach<T>(array: T[], callback: util.ILoopFunction<T>): void
{
	for (const ele of array) {
		if (callback(ele) === false) {
			return;
		}
	}
}