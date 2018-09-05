"use strict";

import {IOnUpdate} from "./CScheduler";
import {CDebug}    from "../CDebug";

export class CSchedulerTask
{
	protected m_key: string                 = "";
	protected m_frameRate: number           = 0;        // seconds
	protected m_frameInterval: number       = 0;
	protected m_priority: number            = 0;

	protected m_onUpdate: IOnUpdate       = null;

	protected m_interval: number            = 0;

	public constructor(key: string, frameRate: number, onUpdate: IOnUpdate, priority: number)
	{
		this.m_key                  = key;
		this.m_frameRate            = frameRate;
		this.m_frameInterval        = this.m_frameRate * 1.000;
		this.m_priority             = priority;
		this.m_onUpdate             = onUpdate;
	}

	public onUpdate(deltaTime: number)
	{
		this.m_interval += deltaTime;
		if (this.m_interval >= this.m_frameInterval) {
			CDebug.logInfoFormat("interval(%d), frameInterval(%d)", this.m_interval, this.m_frameInterval);

			if (this.m_onUpdate !== null) {
				this.m_onUpdate(this.m_interval);
			}
			this.m_interval = 0;
		}
	}

	public get key(): string
	{
		return this.m_key;
	}

	public get frameRate(): number
	{
		return this.m_frameRate;
	}

	public get priority(): number
	{
		return this.m_priority
	}
}