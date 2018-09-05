"use strict";

import * as redis                               from "redis";
import {CBroadcastReceiver, IBroadcastReceiver} from "./CBroadcastReceiver";
import {CSingleton}                             from "../CSingleton";
import {CDebug}                                 from "../CDebug";
import {CRedisConnect}                          from "../database/redis/CRedisConnect";

export class CBroadcastChannel
{
	public static LoadData: string = "LoadData";
}

export class CBroadcast extends CSingleton
{
	protected m_subConnect: redis.RedisClient = null;
	protected m_pubConnect: redis.RedisClient = null;

	protected m_receivers: Map<string, CBroadcastReceiver> = new Map<string, CBroadcastReceiver>();

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	public onInstantiate(): void
	{
		this.m_subConnect = CRedisConnect.instance(CRedisConnect).subConnection();
		this.m_pubConnect = CRedisConnect.instance(CRedisConnect).pubConnection();
		this.broadcast();
	}

	public onDestroyInstance(): void
	{
		this.clear();
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public register(channel: string, onBroadcastReceiver: IBroadcastReceiver): void
	{
		if (!this.has(channel)) {
			const receiver: CBroadcastReceiver = new CBroadcastReceiver();

			this.m_receivers.set(channel, receiver);
			this.subscribe(channel);

			receiver.add(onBroadcastReceiver);
		}
		else {
			CDebug.logErrorFormat("already existed. receiver(%s)", onBroadcastReceiver.name);
			return;
		}
	}

	public unRedister(channel: string): void
	{
		if (this.m_receivers.get(channel)) {
			this.m_receivers.delete(channel);
		}
	}

	public clear(): void
	{
		this.m_receivers.clear();
	}

	public has(key: string): boolean
	{
		if (this.m_receivers.get(key)) {
			return true;
		}
		return false;
	}

	/********************************************************************************************
	 * event
	 ********************************************************************************************/
	public publish(channel: string, value: string = ""): void
	{
		this.m_pubConnect.publish(channel, value);
	}

	protected subscribe(channel: string): void
	{
		this.m_subConnect.subscribe(channel);
	}

	public broadcast(): void
	{
		this.m_subConnect.on("message", async (channel: string, value: string) => {
			switch (channel) {
				case CBroadcastChannel.LoadData: {
					const receiver: CBroadcastReceiver = this.m_receivers.get(channel);
					await receiver.run(value as any);
				}

				// ...
			}
		});
	}
}