"use strict";

import {NextFunction, Request, Response, Router} from "express";
import {CRoute}                                  from "../CRoute";

export class CPlatformGateway extends CRoute
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
		router.post("/platform/*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {

		});
	};

}