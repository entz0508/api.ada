"use strict";

import {CSingleton}                  from "../CSingleton";
import {CLinkedList}                 from "../structure/CLinkedList";
import {IOnTimeEnded, CTimerTask}    from "./CTimerTask";
import {CScheduler, CSchedulerConst} from "../scheduler/CScheduler";
import {CDebug}                      from "../CDebug";

export class CTimerConst
{
	/********************************************************************************************
	 * inspector extension
	 ********************************************************************************************/
	public static RepeatForever: number = Number.MAX_VALUE;
}

export class CTimer extends CSingleton
{
	protected m_isPaused: boolean                       = false;
	protected m_timerTask: CLinkedList<CTimerTask>    = new CLinkedList<CTimerTask>();

	public get isPaused(): boolean
	{
		return this.m_isPaused;
	}

	public pause(): void
	{
		this.m_isPaused = true;
	}

	public resume(): void
	{
		this.m_isPaused = false;
	}

	/********************************************************************************************
	 * release
	 ********************************************************************************************/
	public onInstantiate(): void
	{
		CScheduler.instance(CScheduler).schedule("CTimer", 10, this.onUpdate, CSchedulerConst.Priority.System);
	}

	public onDestroyInstance(): void
	{
		CScheduler.instance(CScheduler).unSchedule("CTimer");

		this.m_isPaused = false;
		this.m_timerTask.clear();
	}

	/********************************************************************************************
	 * register
	 ********************************************************************************************/
	public addAnonymousTimerTask(time: number, repeatCount: number, callback: IOnTimeEnded): void
	{
		const timerTask: CTimerTask = CTimerTask.create("", time, repeatCount, callback);
		this.add(timerTask);
	}

	public addTimerTask(key: string, time: number, repeatCount: number, callback: IOnTimeEnded): void
	{
		if (! this.has(key)) {
			const timerTask: CTimerTask = CTimerTask.create(key, time, repeatCount, callback);
			this.add(timerTask);
			return;
		}
		CDebug.assert(false, "%s timer is already exist", key);
	}

	public add(timerTask: CTimerTask): void
	{
		this.m_timerTask.add(timerTask);
	}

	public has(key: string): boolean
	{
		const count: number = this.m_timerTask.size();
		for (let idx: number = 0; idx < count; ++idx) {
			if (this.m_timerTask.elementAtIndex(idx).id === key) {
				return true;
			}
		}
		return false;
	}

	public getTask(key: string): CTimerTask
	{
		const count: number = this.m_timerTask.size();
		for (let idx: number = 0; idx < count; ++idx) {
			if (this.m_timerTask.elementAtIndex(idx).id === key) {
				return this.m_timerTask.elementAtIndex(idx);
			}
		}
		return null;
	}

	/********************************************************************************************
	 * un register
	 ********************************************************************************************/
	public removeTimerAt(index: number): void
	{
		if (index < 0 || this.m_timerTask.size() <= index) {
			CDebug.assert(false, "out of range(RemoveTimerAt) (%d)", index);
		}

		this.m_timerTask.removeElementAtIndex(index);        // remove
	}

	public removeTimerBy(key: string): void
	{
		const count: number = this.m_timerTask.size();
		for (let idx: number = 0; idx < count; ++idx) {
			if (this.m_timerTask.elementAtIndex(idx).id === key) {
				this.m_timerTask.removeElementAtIndex(idx);
			}
		}
	}

	public clearTimer(invoke: boolean = false): void
	{
		for (let idx: number = 0; idx < this.m_timerTask.size(); ++idx) {
			const timerTask: CTimerTask = this.m_timerTask.elementAtIndex(idx);
			if (invoke) {
				timerTask.invoke();
			}
		}
		this.m_timerTask.clear();
	}

	/********************************************************************************************
	 * manage
	 ********************************************************************************************/
	public addSeconds(key: string, seconds: number): void
	{
		const timerTask: CTimerTask = CTimer.instance(CTimer).getTask(key);
		if (timerTask) {
			timerTask.addSeconds(seconds);
		}
	}

	public subSeconds(key: string, seconds: number): void
	{
		const timerTask: CTimerTask = CTimer.instance(CTimer).getTask(key);
		if (timerTask) {
			timerTask.subSeconds(seconds);
		}
	}

	protected onUpdate(dt: number): void
	{
		if (this.m_isPaused) {
			return;
		}

		if (this.m_timerTask.size() > 0) {
			for (let idx: number = 0; idx < this.m_timerTask.size();) {
				const timerTask: CTimerTask = this.m_timerTask.elementAtIndex(idx);
				if (! timerTask.isPaused && ! timerTask.update(dt)) {
					this.m_timerTask.removeElementAtIndex(idx); // remove
					continue;
				}
				++idx;
			}
		}
	}
}