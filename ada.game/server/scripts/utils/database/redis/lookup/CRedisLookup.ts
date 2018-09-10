"use strict";

import * as redis from "redis";

export abstract class CRedisLookup
{
	protected m_redisNode: redis.RedisClient = null;

	public constructor(redisNode: redis.RedisClient)
	{
		this.m_redisNode = redisNode;
	}

	protected abstract makeLookupData(score: number, member: string): Object;

	protected async makeLookupDataList(data: any): Promise<Object[]>
	{
		const results: any[] = [];

		const keys: string[] = Object.keys(data);
		for (let idx: number = 0, count: number = keys.length; idx < count; ++idx) {
			const member: string    = data[keys[idx]];
			const score: number     = data[keys[++idx]];
			results.push(await this.makeLookupData(score, member));
		}

		return results;
	}

	protected async dbDelete(key: string, member: string): Promise<void>
	{
		await this.m_redisNode.zremAsync(key, member);
	}

	protected async dbAdd(key: string, score: number, member: string): Promise<void>
	{
		await this.m_redisNode.zaddAsync(key, score, member);
	}

	protected async dbIncreaseBy(key: string, expense: number, member: string): Promise<number>
	{
		return await this.m_redisNode.zincrbyAsync(key, expense, member);
	}

	protected async dbAllCount(key: string): Promise<number>
	{
		return await this.m_redisNode.zcardAsync(key);
	}

	protected async dbGetCount(key: string, min: number, max: number): Promise<number>
	{
		return await this.m_redisNode.zcountAsync(key, min, max);
	}

	protected async dbGetScore(key: string, member: string): Promise<number>
	{
		return await this.m_redisNode.zscoreAsync(key, member);
	}

	protected async dbMembers(key: string, firstIndex: number, lastIndex: number): Promise<string[]>
	{
		return await this.m_redisNode.zrangeAsync(key, firstIndex, lastIndex);
	}

	protected async dbGetRank(key: string, member: string): Promise<number>
	{
		return await this.m_redisNode.zrevrankAsync(key, member);
	}

	protected async dbGetScoreSetListByIndex(key: string, firstIndex: number, lastIndex: number, isAsc: boolean = true): Promise<Object[]>
	{
		let scoreSet: string[] = [];
		if (isAsc) {
			scoreSet = await this.m_redisNode.zrangeAsync(key, firstIndex, lastIndex, "withscores");
		}
		else {
			scoreSet = await this.m_redisNode.zrevrangeAsync(key, firstIndex, lastIndex, "withscores");
		}

		return await this.makeLookupDataList(scoreSet);
	}

	protected async dbGetScoreSetListByScore(key: string, firstIndex: number, lastIndex: number, isAsc: boolean = true, offset?: number, length?: number): Promise<Object[]>
	{
		let scoreSet: string[] = [];
		if (isAsc) {
			scoreSet = await this.m_redisNode.zrangebyscoreAsync(key, firstIndex, lastIndex, "withscores", "limit", offset, length);
		}
		else {
			scoreSet = await this.m_redisNode.zrevrangebyscoreAsync(key, firstIndex, lastIndex, "withscores", "limit", offset, length);
		}

		return await this.makeLookupDataList(scoreSet);
	}
}