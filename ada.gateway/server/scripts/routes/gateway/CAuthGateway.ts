"use strict";

import {NextFunction, Request, Response, Router} from "express";
import {CRoute}                                  from "../CRoute";
import {CNetworkRequest, CNetworkRequestPool}    from "../../network/CNetworkRequest";
import {CNetworkResponse, CNetworkResponsePool}  from "../../network/CNetworkResponse";
import {CRPCClient}                              from "../../network/RPC/CRpcClient";
import {CRedisSession}                           from "../../utils/session/CRedisSession";
import {CJson}                                   from "../../utils/CJson";
import {CNetworkConst}                           from "../../network/CNetworkConst";
import {INetworkPacketReader}                    from "../../network/CNetworkPacketReader";

export class CAuthGateway extends CRoute
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
		router.post("/auth/*", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			try {
				this.debugRequest(req);

				const CRequest: CNetworkRequest   = CNetworkRequestPool.alloc(req.body);
				const CResponse: CNetworkResponse = CNetworkResponsePool.alloc();

				const RPCSocket: any = CRPCClient.instance(CRPCClient).socket("login");

				const header: object = {
					"method"    : req.method,
					"url"       : req.originalUrl,
				};

				RPCSocket.call("packet", [header, CRequest.requestCommand], async (err, result: INetworkPacketReader.PacketExecuteResults) =>
				{
					if (! result) {
						CResponse.commandStatus = CNetworkConst.PacketStatus.Fail;
						CResponse.commandResult = {};
						return this.response(CRequest, CResponse, null, res);
					}

					const uuid: number  = CJson.safeIntegerParse(result.commandResult, "uuid", 1000000, false);
					const shard: number = 1;

					let CSession: CRedisSession = null;
					const sessionToken: string = await CRedisSession.getSessionString(uuid);
					if (CRequest.token === sessionToken) {
						CSession = await CRedisSession.getSession(CRequest.token);
					}
					else {
						CSession = await CRedisSession.addSession(uuid, shard);
					}

					CResponse.uuid              = uuid;
					CResponse.token             = CSession.token;
					CResponse.commandStatus     = result.commandStatus;
					CResponse.tokenRegistTime   = CSession.registTime;
					CResponse.tokenUpdateTime   = CSession.updateTime;
					CResponse.tokenExpireTime   = CSession.expireTime;
					CResponse.commandResult     = result.commandResult;

					return this.response(CRequest, CResponse, CSession, res);
				});
			}
			catch (exception) {
				console.error(exception);
				return res.json(exception.stack);
			}
		});
	};

}