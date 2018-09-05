"use strict";

export interface IPoolAbleObject
{
	init(...args): boolean;

	onAlloc(): void;
	onFree(): void;

	release(): void;
}