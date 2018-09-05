"use strict";

export abstract class CSingleton
{
	/********************************************************************************************
	 * abstract
	 ********************************************************************************************/
	protected abstract onInstantiate(): void;
	protected abstract onDestroyInstance(): void;

	/********************************************************************************************
	 * singleton
	 ********************************************************************************************/
	protected static ms_instance: any = null;

	public static instance<T extends CSingleton>(instance: (new () => T)): T
	{
		if (this.ms_instance === null) {
			this.ms_instance = new instance();
            this.ms_instance.onInstantiate();   // on instantiated
        }

		return this.ms_instance;
	}

	public destroyInstance(): void
	{
		if (CSingleton.ms_instance) {
			this.onDestroyInstance();   // on destroy

			CSingleton.ms_instance = undefined;
		}
	}
}