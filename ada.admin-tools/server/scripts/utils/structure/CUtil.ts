"use strict";

const _hasOwnProperty = Object.prototype.hasOwnProperty;

export const has = function (obj: any, prop: any) {
	return _hasOwnProperty.call(obj, prop);
};

export interface ICompareFunction<T>
{
	(a: T, b: T): number;
}

export interface IEqualsFunction<T>
{
	(a: T, b: T): boolean;
}

export interface ILoopFunction<T>
{
	(a: T): boolean | void;
}

export function defaultCompare<T>(a: T, b: T): number
{
	if (a < b) {
		return -1;
	}
	else if (a === b) {
		return 0;
	}
	else {
		return 1;
	}
}

export function defaultEquals<T>(a: T, b: T): boolean
{
	return a === b;
}

export function defaultToString(item: any): string
{
	if (item === null) {
		return 'COLLECTION_NULL';
	}
	else if (isUndefined(item)) {
		return 'COLLECTION_UNDEFINED';
	}
	else if (isString(item)) {
		return '$s' + item;
	}
	else {
		return '$o' + item.toString();
	}
}

export function makeString<T>(item: T, join: string = ','): string
{
	if (item === null) {
		return 'COLLECTION_NULL';
	}
	else if (isUndefined(item)) {
		return 'COLLECTION_UNDEFINED';
	}
	else if (isString(item)) {
		return item.toString();
	}
	else {
		let toret = '{';
		let first = true;
		for (const prop in item) {
			if (has(item, prop)) {
				if (first) {
					first = false;
				} else {
					toret = toret + join;
				}
				toret = toret + prop + ':' + (<any>item)[prop];
			}
		}
		return toret + '}';
	}
}

export function isFunction(func: any): boolean
{
	return (typeof func) === 'function';
}

export function isUndefined(obj: any): obj is undefined
{
	return (typeof obj) === 'undefined';
}

export function isString(obj: any): boolean
{
	return Object.prototype.toString.call(obj) === '[object String]';
}

export function reverseCompareFunction<T>(compareFunction?: ICompareFunction<T>): ICompareFunction<T>
{
	if (isUndefined(compareFunction) || !isFunction(compareFunction)) {
		return function (a, b) {
			if (a < b) {
				return 1;
			} else if (a === b) {
				return 0;
			} else {
				return -1;
			}
		};
	}
	else {
		return function (d: T, v: T) {
			return compareFunction(d, v) * -1;
		};
	}
}

export function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T>
{
	return function (a: T, b: T) {
		return compareFunction(a, b) === 0;
	};
}
