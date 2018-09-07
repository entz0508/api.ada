"use strict";

import {NextFunction, Request, Response, Router} from "express";
import {CRoute}                                  from "../CRoute";
import {CNetworkRequest, CNetworkRequestPool}    from "../../network/CNetworkRequest";
import {CNetworkResponse, CNetworkResponsePool}  from "../../network/CNetworkResponse";
import {CRPCClient}                              from "../../network/RPC/CRpcClient";
import {CRedisSession, CRedisSessionPool}        from "../../utils/session/CRedisSession";

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
			this.debugRequest(req);

			const CRequest: CNetworkRequest   = CNetworkRequestPool.alloc(req.body);
			const CResponse: CNetworkResponse = CNetworkResponsePool.alloc();

			const RPCSocket: any = CRPCClient.instance(CRPCClient).socket("platform");

			const CSession: CRedisSession = CRedisSessionPool.alloc();
			CSession.mapping({"uuid": 100000000, "shard": 0, "session": "faef0c88c7e790314f9cedcba499dba6f820bcec", "registTime": 1534161499746, "updateTime": 1534161499746, "expireTime": 1534161499746});

			const header: object = {
				"method"    : req.method,
				"url"       : req.originalUrl,
				"uuid"      : CSession.uuid,
			};

			RPCSocket.call("packet", [header, CRequest.commands], (err, result) =>
	 		{
				if (result) {
					CResponse.status    = result.commandStatus;
					CResponse.results   = result.resultData;
				}

				return this.response(CRequest, CResponse, CSession, res);
			});
		});
	};

}