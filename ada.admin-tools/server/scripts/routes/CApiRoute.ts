"use strict";

import {NextFunction, Request, Response, Router}    from "express";
import {CRoute}                                     from "./CRoute";
import {CDebug}                                     from "../utils/CDebug";
import {CNetworkPacketReader, INetworkPacketReader} from "../network/CNetworkPacketReader";
import {CSessionModel}                        from "../models/session/CSessionModel";
import {CNetworkConst}                        from "../network/CNetworkConst";
import {CExecuteCommand}                      from "../commands/CExecuteCommand";
import {ICommandResult}                       from "../commands/CCommandResult";
import {CRequestPacket, CRequestPacketPool}   from "../network/CRequestPacket";
import {CResponsePacket, CResponsePacketPool} from "../network/CResponsePacket";
import {INetworkPacketWriter}                 from "../network/CNetworkPacketWriter";

export class CApiRoute extends CRoute
{
	public static create(router: Router): void
	{
		router.post("/game/command", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
			try {
				this.debugRequest(req);

				const request: INetworkPacketReader.Request = CNetworkPacketReader.request(req.body);
				const CRequest: CRequestPacket              = CRequestPacketPool.alloc(request.session, request.dataVersion, request.packetSequenceNo, request.requestCommands);

				const isDailyReset: boolean     = true;
				const inspection: boolean       = false;

				/********************************************************************************************
				 * inspection
				 ********************************************************************************************/
				if (inspection) {

				}

				/********************************************************************************************
				 * data.version
				 ********************************************************************************************/


				/*******************************************************************************************
				 * CResponse.parse
				 ********************************************************************************************/
				// const CSession: CSessionModel    = await CSessionModel.getSessionData(request.session);
				const CSession: CSessionModel = new CSessionModel();
				CSession.mapping({"uuid": 1, "dbShard": "0", "session": "faef0c88c7e790314f9cedcba499dba6f820bcec", "registTime": 1534161499746, "updateTime": 1534161499746, "expireTime": 1534161499746});

				const CResponse: CResponsePacket = CResponsePacketPool.alloc(CRequest.session, CSession.uuid, 0, CRequest.packetSequenceNo, CSession.registTime, CSession.updateTime, CSession.expireTime);

				/********************************************************************************************
				 * session check
				 ********************************************************************************************/
				if (CSession.uuid < 0) {
					CResponse.packetStatus = CNetworkConst.PacketStatus.InvalidSession;

					const responseJSON: Object = CResponse.json();

					CRequest.release();
					CResponse.release();

					this.debugResponse(responseJSON);

					return this.response(req, res, responseJSON);
				}

				/********************************************************************************************
				 * daily reset
				 ********************************************************************************************/
				if (isDailyReset) {

				}

				/********************************************************************************************
				 * processing commands
				 ********************************************************************************************/
				const count: number = CRequest.requestCommands.length;
				for (let idx: number = 0; idx < count; ++idx) {
					const command: INetworkPacketWriter.ResponseCommand = {} as any;
					const commandSequenceNo: number                     = CRequest.requestCommands[idx].commandSequenceNo;
					const packetId: number                              = CRequest.requestCommands[idx].packetId;
					const parameters: Object                            = CRequest.requestCommands[idx].parameters;
					const resultData: ICommandResult                    = await CExecuteCommand.instance(CExecuteCommand).executeCommand(CSession.uuid, CSession.dbShard, packetId, CSession, parameters);

					command[CNetworkConst.Keys.CommandSequenceNo]  = commandSequenceNo;
					command[CNetworkConst.Keys.PacketId]           = packetId;
					command[CNetworkConst.Keys.CommandStatus]      = resultData[CNetworkConst.Keys.CommandStatus];
					command[CNetworkConst.Keys.ResultData]         = resultData[CNetworkConst.Keys.ResultData];

					if (resultData.failedMessage !== "") {
						command[CNetworkConst.Keys.FailedMessage] = resultData.failedMessage;
					}

					CResponse.setResponseCommand(command);

					if (command[CNetworkConst.Keys.CommandStatus] !== CNetworkConst.CommandStatus.Complete) {
						CResponse.packetStatus = CNetworkConst.PacketStatus.FailedCommand;
					}
				}

				if (! CResponse.packetStatus) {
					if (count > 0) {
						CResponse.packetStatus = CNetworkConst.PacketStatus.Complete;
					}
					else {
						CResponse.packetStatus = CNetworkConst.PacketStatus.UnknownCommand;
					}
				}

				const responseJSON: Object = CResponse.json();

				CRequest.release();
				CResponse.release();

				this.debugResponse(responseJSON);

				return this.response(req, res, responseJSON);
			}
			catch (exception) {
				CDebug.logError(exception);
				return this.response(req, res, exception.stack);
			}
		});
	}
}