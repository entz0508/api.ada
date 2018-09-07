"use strict";

import {NextFunction, Request, Response, Router} from "express";
import {CRPCClient}                              from "../../network/RPC/CRpcClient";
import {CRedisSession, CRedisSessionPool}        from "../../utils/session/CRedisSession";
import {CNetworkRequest, CNetworkRequestPool}    from "../../network/CNetworkRequest";
import {CNetworkResponse, CNetworkResponsePool}  from "../../network/CNetworkResponse";
import {CNetworkConst}                           from "../../network/CNetworkConst";
import {CRoute}                                  from "../CRoute";

export class CGameGateway extends CRoute
{
	public static create(router: Router): void
	{
		/**
		 *  request
		 *  {
		 *      session: string,
		 *      version: number,
		 *      commands: {
		 *          ...
		 *      }
		 *  }
		 *
		 *  response
		 *  {
		 *      version: number,
		 *      status: number,
		 *      sessionRegistTime: number,
		 *      sessionUpdateTime: number,
		 *      sessionExpireTime: number,
		 *      results: {
		 *          ...
		 *      }
		 *  }
		 */
		router.post("/game/*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			this.debugRequest(req);

			const CRequest: CNetworkRequest   = CNetworkRequestPool.alloc(req.body);
			const CResponse: CNetworkResponse = CNetworkResponsePool.alloc();

			const RPCSocket: any = CRPCClient.instance(CRPCClient).socket("game");

			/********************************************************************************************
			 * version
			 ********************************************************************************************/

			/********************************************************************************************
			 * session
			 ********************************************************************************************/
			const CSession: CRedisSession = CRedisSessionPool.alloc();
			CSession.mapping({"uuid": 100000000, "shard": 0, "session": "faef0c88c7e790314f9cedcba499dba6f820bcec", "registTime": 1534161499746, "updateTime": 1534161499746, "expireTime": 1534161499746});

			CResponse.version               = 0;
			CResponse.uuid                  = CSession.uuid;
			CResponse.tokenRegistTime       = CSession.registTime;
			CResponse.tokenUpdateTime       = CSession.updateTime;
			CResponse.tokenExpireTime       = CSession.expireTime;

			if (CSession.uuid < 0) {
				CResponse.status = CNetworkConst.PacketStatus.InvalidSession;

				return this.response(CRequest, CResponse, CSession, res);
			}

			const header: object = {
				"method"    : req.method,
				"url"       : req.originalUrl,
				"uuid"      : CSession.uuid,
				"shard"     : CSession.shard
			};

			RPCSocket.call("packet", [header, CRequest.commands], (err, result) =>
			{
				CResponse.status    = result.commandStatus;
				CResponse.results   = result.resultData;

				return this.response(CRequest, CResponse, CSession, res);
			});
		});
	};
}