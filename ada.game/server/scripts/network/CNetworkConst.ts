"use strict";

import {CDebug} from "../utils/CDebug";

export class CNetworkConst
{
	public static Version = class
	{
		public static Error: number                     = -1;   // [진입불가] 오류(버전이 존재하지 않거나. 내부 오류가 발생된 경우)
		public static UnavailableVersion: number        = 0;    // [진입불가] 허용되지 않는 버전
		public static AvailableVersion: number          = 1;    // [진입가능] 최신버전
		public static RecommendUpdateVersion : number   = 2;    // [진입가능] 업데이트 추천

		public static debug(state: number): void
		{
			switch (state) {
				case this.Error:                    { CDebug.logInfoFormat("[진입불가] 오류(클라이언트 버전이 존재하지 않거나. 내부 오류가 발생된 경우)"); return; }
				case this.UnavailableVersion:       { CDebug.logInfoFormat("[진입불가] 허용되지 않는 버전"); return; }
				case this.AvailableVersion:         { CDebug.logInfoFormat("[진입가능] 최신버전"); return; }
				case this.RecommendUpdateVersion:   { CDebug.logInfoFormat("[진입가능] 업데이트 추천"); return; }
			}
		}
	};

	public static Auth = class
	{
		public static CreateByDeviceID:  number         = 1;    // 디바이스 아이디 생성
		public static LoadByDeviceID: number            = 2;    // 디바이스 아이디의 계정으로 로드
		public static CreateByMasterID: number          = 3;    // 마스터 아이디 생성
		public static LoadByMasterID: number            = 4;    // 마스터 아이디의 계정으로 로드
		public static LinkMasterID: number              = 5;    // 현재 계정에 마스터 아이디 연결
		public static OverwriteFromMasterID: number     = 6;    // 마스터 아이디로 연결된 계정을 현재 디바이스에 이전

		public static debug(state: number): void
		{
			switch (state) {
				case this.CreateByDeviceID:      { CDebug.logInfoFormat("디바이스 아이디로 신규 생성을 진행합니다."); return; }
				case this.LoadByDeviceID:        { CDebug.logInfoFormat("기존의 디바이스 아이디 계정을 로드 합니다."); return; }
				case this.CreateByMasterID:      { CDebug.logInfoFormat("마스터 아이디로 신규 생성을 진행합니다."); return; }
				case this.LoadByMasterID:        { CDebug.logInfoFormat("기존의 마스터 아이디 계정을 로드합니다."); return; }
				case this.LinkMasterID:          { CDebug.logInfoFormat("마스터 아이디를 링크합니다."); return; }
				case this.OverwriteFromMasterID: { CDebug.logInfoFormat("마스터 아이디의 계정으로 이전합니다."); return; }
			}
		}
	};

	public static Keys = class
	{
		/***********************************************************************************************************
	     * common
	     ***********************************************************************************************************/
		public static Session: string                           = "session";
		public static UUID: string                              = "uuid";
		public static Shard: string                             = "shard";
		public static DataVersion: string                       = "dataVersion";
		public static PacketSequenceNo: string                  = "packetSequenceNo";           // 최초 네트워크 (로그인) 부터 증가 되는 값 (1부터 시작).

		public static RequestCommands: string                   = "requestCommands";            // 패킷 번들.
		public static PacketId: string                          = "packetId";                   // 패킷 명령 아이디.
		public static Parameters: string                        = "parameters";
		public static CommandSequenceNo: string                 = "commandSequenceNo";          // 클라이언트 측 패킷 명령 순서.

		public static PacketStatus: string                      = "packetStatus";               // 패킷 상태.
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

		/***********************************************************************************************************
		 * packet
		 ***********************************************************************************************************/

	};

	public static PacketId = class
	{
		public static GetUser: string                           = "/game/get/user";
		public static CreateUser: string                        = "/game/create/user";
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

	public static CommandStatus = class
	{
		/***********************************************************************************************************
		 * common
		 ***********************************************************************************************************/
		public static Complete: number                          = 200;                          // 성공.
		public static Fail: number                              = 501;                          // 실패.
		public static UnknownCommand: number                    = 502;                          // 알수없는 명령.

		/***********************************************************************************************************
		 * user
		 ***********************************************************************************************************/

	};
}