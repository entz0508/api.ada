"use strict";

// delegate
export interface IOnTimeEnded
{
	(): void;
}

export class CTimerTask
{
	public static create(key: string, time: number, repeatCount: number, callback: IOnTimeEnded): CTimerTask
	{
		return new CTimerTask(key, time, repeatCount, callback);
	}

	protected m_id: string                      = "";
	protected m_time: number                    = 0.0;
	protected m_count: number                   = 0;
	protected m_interval: number                = 0.0;
	protected m_repeatCount: number             = 0;
	protected m_callback: IOnTimeEnded          = null;
	protected m_isPaused: boolean               = false;

	public constructor(key: string, interval: number, repeatCount: number, callback: IOnTimeEnded)
	{
		this.m_id           = key;
		this.m_interval     = interval;
		this.m_repeatCount  = repeatCount;
		this.m_callback     = callback;
	}

	public get id(): string
	{
		return this.m_id;
	}

	public get time(): number
	{
		return this.m_time;
	}

	public get count(): number
	{
		return this.m_count;
	}

	public get interval(): number
	{
		return this.m_interval;
	}

	public get repeatCount(): number
	{
		return this.m_repeatCount;
	}

	public get isPaused(): boolean
	{
		return this.m_isPaused;
	}

	public update(deltaTime: number): boolean
	{
		this.m_time += deltaTime;
		if (this.m_time >= this.m_interval) {
			this.invoke();  // repeat forever used overflow ( int.MaxValue + 1 = int.MinValue )

			if (this.m_count > this.m_repeatCount) {    // release
				return false;
			}
			else {   // repeat
				this.reset();
			}
		}
		return true;
	}

	public invoke(): void
	{
		++this.m_count;

		if (this.m_callback !== null) {
			this.m_callback();
		}
	}

	public reset(): void
	{
		this.m_time = 0.0;
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public addSeconds(seconds: number): void
	{
		this.m_interval += seconds;
	}

	public subSeconds(seconds: number): void
	{
		this.m_interval -= seconds;
	}
}