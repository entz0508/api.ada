"use strict";

import {CSingleton}     from "../CSingleton";
import {CSchedulerTask} from "./CSchedulerTask";
import {CDebug}         from "../CDebug";
import {CLinkedList}    from "../structure/CLinkedList";
import {CStopWatch}     from "../time/CStopWatch";

// delegate
export interface IOnUpdate
{
	(deltaTime: number): void;
}

export class CSchedulerConst
{
	public static Property = class
	{
		public static FrameInterval: number = 1 * 1000;
	};

	public static Priority = class
	{
		public static System: number    = Number.MAX_VALUE;
		public static Contents: number  = 0;
	};
}

export class CScheduler extends CSingleton
{
	protected m_watch: CStopWatch                       = null;
	protected m_isRunning: boolean                      = false;
	protected m_isPaused: boolean                       = false;
	protected m_elapsedMilliseconds: number             = 0;
	protected m_schedule: CLinkedList<CSchedulerTask>   = new CLinkedList<CSchedulerTask>();
	protected m_interval: any                           = null;

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	public onInstantiate(): void
	{
		if (! this.m_isRunning) {
			this.m_watch = new CStopWatch();
			this.m_isRunning = true;
			this.m_isPaused = false;
			this.m_watch.start();
			this.update();
		}
	}

	public onDestroyInstance(): void
	{
		this.m_watch.reset();
		this.m_isRunning = false;
		this.m_elapsedMilliseconds = 0;
		clearInterval(this.m_interval);
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public schedule(key: string, frameRate: number, onUpdate: IOnUpdate, priority: number = CSchedulerConst.Priority.System): void
	{
		if (this.hasSchedule(key)) {
			CDebug.assert(false, "already register key(%s)", key);
			return;
		}

		this.m_schedule.add(new CSchedulerTask(key, frameRate, onUpdate, priority));
	}

	public unSchedule(key: string): void
	{
		const count: number = this.m_schedule.size();
		for (let idx: number = 0; idx < count; ++idx) {
			if (this.m_schedule.elementAtIndex(idx).key === key) {
				this.m_schedule.removeElementAtIndex(idx);
				return;
			}
		}
		CDebug.assert(false, "cannot find key(%s)", key);
	}

	public unScheduleAll(priority: number): void
	{
		const count: number = this.m_schedule.size();
		for (let idx: number = 0; idx < count;) {
			if (this.m_schedule.elementAtIndex(idx).priority === priority) {
				this.m_schedule.removeElementAtIndex(idx);
				continue;
			}
			++idx;
		}
	}

	public hasSchedule(key: string): boolean
	{
		const count: number = this.m_schedule.size();
		for (let idx: number = 0; idx < count; ++idx) {
			if (this.m_schedule.elementAtIndex(idx).key === key) {
				return true;
			}
		}
		return false;
	}

	/********************************************************************************************
	 * update
	 ********************************************************************************************/
	public pause(): void
	{
		if (! this.m_isPaused) {
			this.m_isPaused = true;
		}
	}

	public resume(): void
	{
		if (! this.m_isPaused) {
			this.m_isPaused = false;
		}
	}

	protected update(): void
	{
		this.m_interval = setInterval(() => {
			if (! this.m_isPaused) {
				const deltaMillisecondTime: number = this.m_watch.elapsedMilliseconds - this.m_elapsedMilliseconds;
				this.m_elapsedMilliseconds = this.m_watch.elapsedMilliseconds;

				const count: number= this.m_schedule.size();
				for (let idx: number = 0; idx < count; ++idx) {
					this.m_schedule.elementAtIndex(idx).onUpdate(deltaMillisecondTime / 1000.0);
				}
			}
		}, CSchedulerConst.Property.FrameInterval);
	}
}