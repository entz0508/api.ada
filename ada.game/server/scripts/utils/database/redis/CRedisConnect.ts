"use strict";

import * as redis    from "redis";
import * as bluebird from "bluebird";
import {CConfig}     from "../../../config/CConfig";
import {CDebug}      from "../../CDebug";
import {CSingleton}  from "../../CSingleton";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

declare module "redis"
{
	export interface RedisClient extends NodeJS.EventEmitter
	{
		existsAsync(key: string): Promise<number>;

		expireAsync(key: string, seconds: number): Promise<number>;

		getAsync(key: string): Promise<string>;

		getbitAsync(key: string, offset: number): Promise<number>;

		getrangeAsync(key: string, start: number, end: number): Promise<string>;

		getsetAsync(key: string, value: string): Promise<string>;

		delAsync(key: string): Promise<number>;

		hdelAsync(key: string, fields: string[]): Promise<number>;

		hexistsAsync(key: string, field: string): Promise<number>;

		hgetAsync(key: string, field: string): Promise<string>

		hgetallAsync(key: string): Promise<{ [key: string]: string }>;

		hmgetAsync(key: string, fields: string[]): Promise<string[]>;

		hsetAsync(key: string, field: string, value: string): Promise<number>;

		hmsetAsync(key: string, values: object): Promise<number>;

		hsetnxAsync(key: string, field: string, value: string): Promise<number>;

		setAsync(key: string, values: string): Promise<number>;

		setexAsync(key: string, seconds: number, value: string): Promise<string>;

		zaddAsync(key: string, score: number, member: string): Promise<number>;

		zremAsync(key: string, member: string): Promise<void>;

		zaddAsync(key: string, score: number, member: string, mode?: boolean): Promise<number>;

		zincrbyAsync(key: string, expanse: number, member: string): Promise<number>;

		zcardAsync(key: string): Promise<number>;

		zcountAsync(key: string, min: number, max: number): Promise<number>;

		zscoreAsync(key: string, member: string): Promise<number>;

		zrangeAsync(key: string, firstIndex: number, lastIndex: number, withscores?: string): Promise<string[]>;

		zrevrankAsync(key: string, member: string): Promise<number>;

		zrevrangeAsync(key: string, firstIndex: number, lastIndex: number, withscores: string): Promise<string[]>;

		zrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores?: string, limit?: string, offset?: number, length?: number): Promise<string[]>;

		zrevrangebyscoreAsync(key: string, max: number | string, min: number | string, withscores?: string, limit?: string, offset?: number, length?: number): Promise<string[]>;

		// publishAsync(channel: string, value: string): Promise<number>;

		// subscribeAsync(channel: string): Promise<number>;
	}
}

export class CRedisConnect extends CSingleton
{
	protected m_instance: redis.RedisClient     = null;

	protected m_subInstance: redis.RedisClient  = null;
	protected m_pubInstance: redis.RedisClient  = null;

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	public onInstantiate(): void
	{

	}

	public onDestroyInstance(): void
	{

	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	protected createConnect(host: string, port: number, database: number, password: string): redis.RedisClient
	{
		/**
		 * host	                        127.0.0.1   IP address of the Redis server
		 * port	                        6379	    Port of the Redis server
		 * path	                        null	    The UNIX socket string of the Redis server
		 * url	                        null	    The URL of the Redis server. Format: [redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&options=value]]] (More info avaliable at IANA).
		 * string_numbers               null	    Set to true, node_redis will return Redis number values as Strings instead of javascript Numbers. Useful if you need to handle big numbers (above Number.MAX_SAFE_INTEGER === 2^53). Hiredis is incapable of this behavior, so options this options to true will result in the built-in javascript parser being used no matter the value of the parser options.
		 * return_buffers               false       If set to true, then all replies will be sent to callbacks as Buffers instead of Strings.
		 * detect_buffers               false       If set to true, then replies will be sent to callbacks as Buffers. This options lets you switch between Buffers and Strings on a per-command basis, whereas return_buffers applies to every command on a client. Note: This doesn't work properly with the pubsub mode. A subscriber has to either always return Strings or Buffers.
		 * socket_keepalive             true	    If set to true, the keep-alive functionality is enabled on the underlying socket.
		 * no_ready_check               false       When a connection is established to the Redis server, the server might still be loading the database from disk. While loading, the server will not respond to any commands. To work around this, node_redis has a "ready check" which sends the INFO command to the server. The response from the INFO command indicates whether the server is ready for more commands. When ready, node_redis emits a ready event. Setting no_ready_check to true will inhibit this check.
		 * enable_offline_queue         true	    By default, if there is no active connection to the Redis server, commands are added to a queue and are executed once the connection has been established. Setting enable_offline_queue to false will disable this feature and the callback will be executed immediately with an error, or an error will be emitted if no callback is specified.
		 * retry_unfulfilled_commands   false       If set to true, all commands that were unfulfilled while the connection is lost will be retried after the connection has been reestablished. Use this with caution if you use state altering commands (e.g. incr). This is especially useful if you use blocking commands.
		 * password	                    null        If set, client will run Redis auth command on connect. Alias auth_pass Note node_redis < 2.5 must use auth_pass
		 * db	                        null        If set, client will run Redis select command on connect.
		 * family	                    IPv4        You can force using IPv6 if you set the family to 'IPv6'. See Node.js net or dns modules on how to use the family type.
		 * disable_resubscribing        false       If set to true, a client won't resubscribe after disconnecting.
		 * rename_commands              null        Passing an object with renamed commands to use instead of the original functions. For example, if you renamed the command KEYS to "DO-NOT-USE" then the rename_commands object would be: { KEYS : "DO-NOT-USE" } . See the Redis security topics for more info.
		 * tls	                        null        An object containing options to pass to tls.connect to set up a TLS connection to Redis (if, for example, it is set up to be accessible via a tunnel).
		 * prefix	                    null        A string used to prefix all used keys (e.g. namespace:test). Please be aware that the keys command will not be prefixed. The keys command has a "pattern" as argument and no key and it would be impossible to determine the existing keys in Redis if this would be prefixed.
		 * retry_strategy               function    A function that receives an options object as parameter including the retry attempt, the total_retry_time indicating how much time passed since the last time connected, the error why the connection was lost and the number of times_connected in total. If you return a number from this function, the retry will happen exactly after that time in milliseconds. If you return a non-number, no further retry will happen and all offline commands are flushed with errors. Return an error to return that specific error to all offline commands. Example below.
		 * */
		const option: redis.ClientOpts = {
			"host": host,
			"port": port
		};
		return redis.createClient(option);
	}

	public connection(): redis.RedisClient
	{
		if (this.m_instance === null) {
			this.m_instance = this.createConnect(
				CConfig.Env.RedisMaster.Host,
				CConfig.Env.RedisMaster.Port,
				CConfig.Env.RedisMaster.Database,
				CConfig.Env.RedisMaster.Password
			);
		}

		this.m_instance.on("error", (error) => {
			CDebug.assert(false, "Redis connected error: %j", error);
		});

		return this.m_instance;
	}

	public pubConnection(): redis.RedisClient
	{
		if (this.m_pubInstance === null) {
			this.m_pubInstance = this.createConnect(
				CConfig.Env.RedisMaster.Host,
				CConfig.Env.RedisMaster.Port,
				CConfig.Env.RedisMaster.Database,
				CConfig.Env.RedisMaster.Password
			)
		}

		this.m_pubInstance.on("error", (error) => {
			CDebug.assert(false, "Redis publish connected error: %j", error);
		});

		return this.m_pubInstance;
	}

	public subConnection(): redis.RedisClient
	{
		if (this.m_subInstance === null) {
			this.m_subInstance = this.createConnect(
				CConfig.Env.RedisMaster.Host,
				CConfig.Env.RedisMaster.Port,
				CConfig.Env.RedisMaster.Database,
				CConfig.Env.RedisMaster.Password
			)
		}

		this.m_subInstance.on("error", (error) => {
			CDebug.assert(false, "Redis subscribe connected error: %j", error);
		});

		return this.m_subInstance;
	}
}