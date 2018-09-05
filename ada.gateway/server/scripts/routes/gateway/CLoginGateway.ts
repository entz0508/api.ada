"use strict";

import {NextFunction, Request, Response, Router} from "express";
import {CRoute}                                  from "../CRoute";

export class CLoginGateway extends CRoute
{
	public static create(router: Router): void
	{
		/**
		 *  request
		 *  {
		 *  }
		 *
		 *  response
		 *  {
		 *  }
		 */
		router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {

		});
	};

}