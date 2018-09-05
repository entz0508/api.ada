"use strict";

import {NextFunction, Request, Response, Router}      from "express";
import {CRpcClient}                                   from "../../network/RPC/CRpcClient";
import {CRedisSession, CRedisSessionPool}             from "../../utils/session/CRedisSession";
import {CNetworkRequest, CNetworkRequestPacketPool}   from "../../network/CNetworkRequest";
import {CNetworkResponse, CNetworkResponsePacketPool} from "../../network/CNetworkResponse";
import {CNetworkConst}                                from "../../network/CNetworkConst";
import {CRoute}                                       from "../CRoute";

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

			const CRequest: CNetworkRequest   = CNetworkRequestPacketPool.alloc(req.body);
			const CResponse: CNetworkResponse = CNetworkResponsePacketPool.alloc();

			const RPCSocket: any = CRpcClient.instance(CRpcClient).socket("game");

			/********************************************************************************************
			 * version
			 ********************************************************************************************/

			/********************************************************************************************
			 * session
			 ********************************************************************************************/
			const CSession: CRedisSession = CRedisSessionPool.alloc();
			CSession.mapping({"uuid": 100000000, "dbShard": 0, "session": "faef0c88c7e790314f9cedcba499dba6f820bcec", "registTime": 1534161499746, "updateTime": 1534161499746, "expireTime": 1534161499746});

			CResponse.version               = 0;
			CResponse.uuid                  = CSession.uuid;
			CResponse.sessionRegistTime     = CSession.registTime;
			CResponse.sessionUpdateTime     = CSession.updateTime;
			CResponse.sessionExpireTime     = CSession.expireTime;

			if (CSession.uuid < 0) {
				CResponse.status = CNetworkConst.PacketStatus.InvalidSession;

				return this.response(CSession, CRequest, CResponse, res);
			}

			const header: object = {
				"method"    : req.method,
				"url"       : req.originalUrl,
				"uuid"      : CSession.uuid,
				"shard"     : CSession.dbShard
			};

			RPCSocket.call("packet", [header, CRequest.commands], (err, result) =>
			{
				CResponse.status    = result.commandStatus;
				CResponse.results   = result.resultData;

				return this.response(CSession, CRequest, CResponse, res);
			});
		});
	};
}