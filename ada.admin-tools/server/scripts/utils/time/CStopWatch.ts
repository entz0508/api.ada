"use strict";

import {CDebug} from "../CDebug";

export class CStopWatch
{
	protected m_startTime: number       = 0;
	protected m_stopTime: number        = 0;
	protected m_isRunning: boolean      = false;

	public get startTime(): number
	{
		return this.m_startTime;
	}

	public get stopTime(): number
	{
		return this.m_stopTime;
	}

	public get elapsedMilliseconds(): number
	{
		return ((this.m_isRunning ? Date.now() : this.m_stopTime) - this.m_startTime) || 0;
	}

	public start(): number
	{
		if (this.m_isRunning) {
			CDebug.assert(false, "The stopwatch is already running!");
			return;
		}

		this.m_startTime = Date.now();
		this.m_isRunning = true;

		return this.m_startTime;
	}

	public stop(): number
	{
		if (!this.m_isRunning) {
			CDebug.assert(false, "You must start the timer first!");
			return;
		}

		this.m_stopTime  = Date.now();
		this.m_isRunning = false;

		return this.m_stopTime;
	}

	public restart(): number
	{
		const elapsed: number = this.stop();
		this.start();
		return elapsed;
	}

	public reset(): number
	{
		const elapsed: number = this.elapsedMilliseconds;

		this.m_startTime = 0;
		this.m_stopTime  = 0;
		this.m_isRunning = false;

		return elapsed;
	}

	public get running(): boolean
	{
		return this.m_isRunning;
	}
}
