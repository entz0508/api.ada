"use strict";

export class CTime
{
	public static Seconds = class
	{
		public static Min: number           = 60;
		public static Hour: number          = 60 * 60;
		public static Day: number           = 60 * 60 * 24;
	};

	public static Milliseconds = class
	{
		public static Min: number           = 60 * 1000;
		public static Hour: number          = 60 * 60 * 1000;
		public static Day: number           = 60 * 60 * 24 * 1000;
	};

	public static Zone = class
	{
		public static Code = class
		{
			public static UTC: number       = 0;
			public static KR: number        = 1;    // 대한민국
			public static JP: number        = 2;    // 일본
			public static CN: number        = 3;    // 중국
			public static ID: number        = 4;    // 인도네시아 (서부)
			public static TH: number        = 5;    // 태국
			public static VN: number        = 6;    // 베트남
			public static RU: number        = 7;    // 러시아
			public static ES: number        = 8;    // 스페인
			public static FR: number        = 9;    // 프랑스
			public static DE: number        = 10;   // 독일
			public static PT: number        = 11;   // 포르투칼
			public static NL: number        = 12;   // 네덜란드
			public static IT: number        = 13;   // 이탈리아
			public static US: number        = 14;   // 미국 (동부)

			// public static readonly Array: number[] = [CTime.Zone.Code.UTC, CTime.Zone.Code.KR, CTime.Zone.Code.JP, CTime.Zone.Code.CN, CTime.Zone.Code.ID, CTime.Zone.Code.TH, CTime.Zone.Code.VN, CTime.Zone.Code.RU, CTime.Zone.Code.ES, CTime.Zone.Code.FR, CTime.Zone.Code.DE, CTime.Zone.Code.PT, CTime.Zone.Code.NL, CTime.Zone.Code.IT, CTime.Zone.Code.US];
			public static readonly Names: string[] = ["UTC", "KR", "JP", "CN", "ID", "TH", "VN", "RU", "ES", "FR", "DE", "PT", "NL", "IT", "US"];
		};

		public static Offset = class
		{
			public static UTC: number       = 0;
			public static KR: number        = CTime.Milliseconds.Hour * 9;
			public static JP: number        = CTime.Milliseconds.Hour * 9;
			public static CN: number        = CTime.Milliseconds.Hour * 8;
			public static ID: number        = CTime.Milliseconds.Hour * 7;
			public static TH: number        = CTime.Milliseconds.Hour * 7;
			public static VN: number        = CTime.Milliseconds.Hour * 7;
			public static RU: number        = CTime.Milliseconds.Hour * 3;
			public static ES: number        = CTime.Milliseconds.Hour * 1;
			public static FR: number        = CTime.Milliseconds.Hour * 1;
			public static DE: number        = CTime.Milliseconds.Hour * 1;
			public static PT: number        = CTime.Milliseconds.Hour * 1;
			public static NL: number        = CTime.Milliseconds.Hour * 1;
			public static IT: number        = CTime.Milliseconds.Hour * 1;
			public static US: number        = CTime.Milliseconds.Hour * -5;

			public static get(zone: number): number
			{
				switch (zone) {
					case CTime.Zone.Code.UTC: { return CTime.Zone.Offset.UTC; }
					case CTime.Zone.Code.KR:  { return CTime.Zone.Offset.KR; }
					case CTime.Zone.Code.JP:  { return CTime.Zone.Offset.JP; }
					case CTime.Zone.Code.CN:  { return CTime.Zone.Offset.CN; }
					case CTime.Zone.Code.ID:  { return CTime.Zone.Offset.ID; }
					case CTime.Zone.Code.TH:  { return CTime.Zone.Offset.TH; }
					case CTime.Zone.Code.VN:  { return CTime.Zone.Offset.VN; }
					case CTime.Zone.Code.RU:  { return CTime.Zone.Offset.RU; }
					case CTime.Zone.Code.ES:  { return CTime.Zone.Offset.ES; }
					case CTime.Zone.Code.FR:  { return CTime.Zone.Offset.FR; }
					case CTime.Zone.Code.DE:  { return CTime.Zone.Offset.DE; }
					case CTime.Zone.Code.PT:  { return CTime.Zone.Offset.PT; }
					case CTime.Zone.Code.NL:  { return CTime.Zone.Offset.NL; }
					case CTime.Zone.Code.IT:  { return CTime.Zone.Offset.IT; }
					case CTime.Zone.Code.US:  { return CTime.Zone.Offset.US; }
				}
				return CTime.Zone.Offset.UTC;
			}

			// public static readonly Array: number[] = [CTime.Zone.Offset.UTC, CTime.Zone.Offset.KR, CTime.Zone.Offset.JP, CTime.Zone.Offset.CN, CTime.Zone.Offset.ID, CTime.Zone.Offset.TH, CTime.Zone.Offset.VN, CTime.Zone.Offset.RU, CTime.Zone.Offset.ES, CTime.Zone.Offset.FR, CTime.Zone.Offset.DE, CTime.Zone.Offset.PT, CTime.Zone.Offset.NL, CTime.Zone.Offset.IT, CTime.Zone.Offset.US];
		};
	};

	public static Util = class
	{
		protected  static getUTCTime(): number
		{
			// const now: Date = new Date();
			// const timezone: number = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
			// return now.setTime(timezone);
			return Date.now();
		}

		public static getServerTimeStamp(zone: number = CTime.Zone.Code.UTC): number
		{
			return CTime.Util.getUTCTime() + CTime.Zone.Offset.get(zone);
		}

		public static getPassedMidnightDate(date: number, zone: number = CTime.Zone.Code.UTC): number
		{
			return (date - date % CTime.Milliseconds.Day) + CTime.Zone.Offset.get(zone);
		}

		public static getApproachMidnightDate(date: number, zone: number = CTime.Zone.Code.UTC): number
		{
			return (date - (date % CTime.Milliseconds.Day) + CTime.Milliseconds.Day) + CTime.Zone.Offset.get(zone);
		}
	};
}