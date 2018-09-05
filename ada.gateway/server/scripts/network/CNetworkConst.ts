"use strict";

export class CNetworkConst
{
	public static Keys = class
	{
		/***********************************************************************************************************
		 * common
		 ***********************************************************************************************************/
		public static Session: string                           = "session";
		public static UUID: string                              = "uuid";
		public static DBShard: string                           = "dbShard";
		public static DataVersion: string                       = "version";
		public static PacketSequenceNo: string                  = "packetSequenceNo";           // 최초 네트워크 (로그인) 부터 증가 되는 값 (1부터 시작).

		public static Commands: string                          = "commands";
		public static RequestCommands: string                   = "requestCommands";            // 패킷 번들.
		public static PacketId: string                          = "packetId";                   // 패킷 명령 아이디.
		public static Parameters: string                        = "parameters";
		public static CommandSequenceNo: string                 = "commandSequenceNo";          // 클라이언트 측 패킷 명령 순서.

		public static Status: string                            = "status";                     // 패킷 상태.
		public static Results: string                           = "results";                    // 패킷 결과.
		public static ResponseCommands: string                  = "responseCommands";           // 패킷 번들 결과.
		public static CommandStatus: string                     = "commandStatus";              // 패킷 결과 상태.
		public static ResultData: string                        = "resultData";                 // 결과 데이터.
		public static FailedMessage: string                     = "failedMessage";              // 패킷 실패 메시지

		public static UpdateTime: string                        = "updateTime";
		public static RegistTime: string                        = "registTime";
		public static ExpireTime: string                        = "expireTime";

		/***********************************************************************************************************
		 * session
		 ***********************************************************************************************************/
		public static SessionRegistTime: string                 = "sessionRegistTime";
		public static SessionUpdateTime: string                 = "sessionUpdateTime";
		public static SessionExpireTime: string                 = "sessionExpireTime";
	};

	public static PacketStatus = class
	{
		public static ServerInspect: number                     = 104;                          // 서버 점검
		public static Complete: number                          = 200;                          // 성공
		public static Fail: number                              = 501;                          // 실패
		public static FailedCommand: number                     = 503;                          // 명령 처리중 실패한 task 존재
		public static InvalidSession: number                    = 504;                          // 로그인 세션이 필요함. (로그인 세션이 끊겼거나 로그인이 되지 않은 상태)
		public static UnknownCommand: number                    = 505;                          // 유효하지 않는 명령
	};
}