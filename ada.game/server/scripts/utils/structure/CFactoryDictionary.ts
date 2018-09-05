"use strict";

import {CDictionary} from './CDictionary';
import * as util     from './CUtil';

export class CFactoryDictionary<K, V> extends CDictionary<K, V>
{
	protected m_defaultFactoryFunction: () => V;

	constructor(defaultFactoryFunction: () => V, toStrFunction?: (key: K) => string)
	{
		super(toStrFunction);

		this.m_defaultFactoryFunction = defaultFactoryFunction;
	}

	public setDefault(key: K, defaultValue: V): V
	{
		const currentValue: V | undefined = super.getValue(key);

		if (util.isUndefined(currentValue)) {
			this.setValue(key, defaultValue);

			return defaultValue;
		}

		return currentValue;
	}

	public getValue(key: K): V
	{
		return this.setDefault(key, this.m_defaultFactoryFunction());
	}
}
