"use strict";

export interface IModel
{
	mapping(data: Object): void;
	json(): Object;
}