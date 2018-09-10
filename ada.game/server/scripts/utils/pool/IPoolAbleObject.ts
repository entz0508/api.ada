"use strict";

export interface IPoolAbleObject
{
	init(...args: any[]): boolean;

	onAlloc(): void;
	onFree(): void;

	release(): void;
}