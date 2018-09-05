"use strict";

// delegate
export interface IBroadcastReceiver
{
	(args?: Object[] | any): Promise<void>
}

export class CBroadcastReceiver
{
	protected m_receiver: IBroadcastReceiver = null;

	public add(receiver: IBroadcastReceiver): void
	{
		this.m_receiver = receiver;
	}

	public async run(args?: Object[]): Promise<void>
	{
		return await this.m_receiver(args);
	}

	public remove(): void
	{
		this.m_receiver = null;
	}

	/** unimplemented */ private clear(): void
	{

	}

	/** unimplemented */ private invoke(args: Object[]): void
	{

	}

	/** unimplemented */ private has(receiver: IBroadcastReceiver): boolean
	{
		return true;
	}
}