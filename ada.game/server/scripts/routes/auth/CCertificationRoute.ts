"use strict";

import {CRoute}                                  from "../CRoute";
import {NextFunction, Request, Response, Router} from "express";
import {CDebug}                                  from "../../utils/CDebug";

export class CCertificationRoute extends CRoute
{
	public static create(router: Router): void
	{
		router.post("/auth/certification", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
			try {
				this.debugRequest(req);

				const response: Object = {};

				this.debugResponse(res);

				return this.response(req, res, response);
			}
			catch (exception) {
				CDebug.logError(exception);
				return this.response(req, res, exception.stack);
			}
		});
	}
}
