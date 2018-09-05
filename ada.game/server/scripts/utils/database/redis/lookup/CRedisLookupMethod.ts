"use strict";

import {CRedisLookup} from "./CRedisLookup";
import * as redis     from "redis";

export abstract class CRedisLookupMethod extends CRedisLookup
{
	public constructor(redisNode: redis.RedisClient)
	{
		super(redisNode);
	}

	protected abstract getKeyName(): string;

	protected abstract makeLookupData(score: number, member: string): Object;

	public async del(member: string): Promise<void>
	{
		await this.dbDelete(this.getKeyName(), member);
	}

	public async add(score: number, member: string): Promise<void>
	{
		await this.dbAdd(this.getKeyName(), score, member);
	}

	public async increaseBy(expanse: number, member: string): Promise<number>
	{
		return await this.dbIncreaseBy(this.getKeyName(), expanse, member);
	}

	public async getAllCount(): Promise<number>
	{
		return await this.dbAllCount(this.getKeyName());
	}

	public async getCount(min: number, max: number): Promise<number>
	{
		return await this.dbGetCount(this.getKeyName(), min, max);
	}

	public async getScore(member: string): Promise<number>
	{
		return await this.dbGetScore(this.getKeyName(), member);
	}

	public async getMemberList(firstIndex: number, lastIndex: number): Promise<string[]>
	{
		return await this.dbMembers(this.getKeyName(), firstIndex, lastIndex);
	}

	public async getRank(member: string): Promise<number>
	{
		return await this.dbGetRank(this.getKeyName(), member);
	}

	public async getDataListByIndex(firstIndex: number, lastIndex: number, isAsc: boolean = true): Promise<Object[]>
	{
		return await this.dbGetScoreSetListByIndex(this.getKeyName(), firstIndex, lastIndex, isAsc);
	}

	public async getDataListByScore(firstIndex: number, lastIndex: number, isAsc: boolean = true, offset?: number, length?: number): Promise<Object[]>
	{
		return await this.dbGetScoreSetListByScore(this.getKeyName(), firstIndex, lastIndex, isAsc, offset, length);
	}
}