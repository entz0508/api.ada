"use strict";

export class CLocalize
{
	/*******************************************************************************************
	 * Language(* ISO 639-1)
	 * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
	 *
	 * Country(* ISO 3166-1 alpha-2)
	 * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
	 *
	 * https://stackoverflow.com/questions/3040677/locale-codes-for-iphone-lproj-folders
	 * | lproj identifiers                  | L#  | C#  | Display name               |
	 * |:-----------------------------------|:----|:----|:---------------------------|
	 * | [1] en_US = en = English           | 0   | 0   | English (United States)    |
	 * | [1] en_GB                          | 0   | 2   | English (United Kingdom)   |
	 * | [1] en_AU                          | 0   | 15  | English (Australia)        |
	 * | [1] en_CA                          | 0   | 82  | English (Canada)           |
	 * | [1] en_SG                          | 0   | 100 | English (Singapore)        |
	 * | [1] en_IE                          | 0   | 108 | English (Ireland)          |
	 * | [2] fr_FR = fr = French            | 1   | 1   | French (France)            |
	 * | [2] fr_CA                          | 1   | 11  | French (Canada)            |
	 * | [2] fr_CH                          | 1   | 18  | French (Switzerland)       |
	 * | [2] fr_BE                          | 1   | 98  | French (Belgium)           |
	 * | [3] de_DE = de = German            | 2   | 3   | German (Germany)           |
	 * | [3] de_CH                          | 2   | 19  | German (Switzerland)       |
	 * | [3] de_AT                          | 2   | 92  | German (Austria)           |
	 * | [4] it_IT = it = Italian           | 3   | 4   | Italian (Italy)            |
	 * | [4] it_CH                          | 3   | 36  | Italian (Switzerland)      |
	 * | [5] nl_NL = nl = Dutch             | 4   | 5   | Dutch (Netherlands)        |
	 * | [5] nl_BE                          | 34  | 6   | Dutch (Belgium)            |
	 * | [-] sv_SE = sv = Swedish           | 5   | 7   | Swedish (Sweden)           |
	 * | [6] es_ES = es = Spanish           | 6   | 8   | Spanish (Spain)            |
	 * | [7] es_XL                          | 6   | 86  | Spanish (Latin America)    |
	 * | [-] da_DK = da = Danish            | 7   | 9   | Danish (Denmark)           |
	 * | [-] pt_BR = pt = Portuguese        | 8   | 71  | Portuguese (Brazil)        |
	 * | [-] pt_PT                          | 8   | 10  | Portuguese (Portugal)      |
	 * | [-] nb_NO = nb = no = Norwegian    | 9   | 12  | Norwegian Bokmål (Norway)  |
	 * | [-] nn_NO = nn = Nynorsk           | 151 | 101 | Norwegian Nynorsk (Norway) |
	 * | [-] he_IL = he = Hebrew            | 10  | 13  | Hebrew (Israel)            |
	 * | [-] ja_JP = ja = Japanese          | 11  | 14  | Japanese (Japan)           |
	 * | [-]         ar = Arabic            | 12  | 16  | Arabic                     |
	 * | [-] fi_FI = fi = Finnish           | 13  | 17  | Finnish (Finland)          |
	 * | [-] el_GR = el = Greek             | 14  | 20  | Greek (Greece)             |
	 * | [-] el_CY                          | 14  | 23  | Greek (Cyprus)             |
	 * | [-] is_IS = is = Icelandic         | 15  | 21  | Icelandic (Iceland)        |
	 * | [-] mt_MT = mt = Maltese           | 16  | 22  | Maltese (Malta)            |
	 * | [-] tr_TR = tr = Turkish           | 17  | 24  | Turkish (Turkey)           |
	 * | [-] hr_HR = hr = Croatian          | 18  | 68  | Croatian (Croatia)         |
	 * | [-] zh_TW = zh-Hant                | 19  | 53  | Chinese (Taiwan)           |
	 * | [-] zh_CN = zh = zh-Hans = Chinese | 33  | 52  | Chinese (China)            |
	 * | [-] ur_PK = ur = Urdu              | 20  | 34  | Urdu (Pakistan)            |
	 * | [-] ur_IN                          | 20  | 96  | Urdu (India)               |
	 * | [-] hi_IN = hi = Hindi             | 21  | 33  | Hindi (India)              |
	 * | [-] th_TH = th = Thai              | 22  | 54  | Thai (Thailand)            |
	 * | [-] ko_KR = ko = Korean            | 23  | 51  | Korean (South Korea)       |
	 * | [-] lt_LT = lt = Lithuanian        | 24  | 41  | Lithuanian (Lithuania)     |
	 * | [-] pl_PL = pl = Polish            | 25  | 42  | Polish (Poland)            |
	 * | [-] hu_HU = hu = Hungarian         | 26  | 43  | Hungarian (Hungary)        |
	 * | [-] et_EE = et = Estonian          | 27  | 44  | Estonian (Estonia)         |
	 * | [-] lv_LV = lv = Latvian           | 28  | 45  | Latvian (Latvia)           |
	 * | [-]         se = Sami              | 29  | 46  | Northern Sami              |
	 * | [-] fo_FO = fo = Faroese           | 30  | 47  | Faroese (Faroe Islands)    |
	 * | [-] fa_IR = fa = Farsi             | 31  | 48  | Persian (Iran)             |
	 * | [-] ru_RU = ru = Russian           | 32  | 49  | Russian (Russia)           |
	 * | [-] ga_IE = ga = Irish             | 35  | 50  | Irish (Ireland)            |
	 * | [-]         sq = Albanian          | 36  | -1  | Albanian                   |
	 * | [-] ro_RO = ro = Romanian          | 37  | 39  | Romanian (Romania)         |
	 * | [-] cs_CZ = cs = Czech             | 38  | 56  | Czech (Czech Republic)     |
	 * | [-] sk_SK = sk = Slovak            | 39  | 57  | Slovak (Slovakia)          |
	 * | [-] sl_SI = sl = Slovenian         | 40  | 66  | Slovenian (Slovenia)       |
	 * | [-]         yi = Yiddish           | 41  | -1  | Yiddish                    |
	 * | [-] sr_CS = sr = Serbian           | 42  | 65  | Serbian (Serbia)           |
	 * | [-] mk_MK = mk = Macedonian        | 43  | 67  | Macedonian (Macedonia)     |
	 * | [-] bg_BG = bg = Bulgarian         | 44  | 72  | Bulgarian (Bulgaria)       |
	 * | [-] uk_UA = uk = Ukrainian         | 45  | 62  | Ukrainian (Ukraine)        |
	 * | [-] be_BY = be = Byelorussian      | 46  | 61  | Belarusian (Belarus)       |
	 * | [-] uz_UZ = uz = Uzbek             | 47  | 99  | Uzbek (Uzbekistan)         |
	 * | [-]         kk = Kazakh            | 48  | -1  | Kazakh                     |
	 * | [-] hy_AM = hy = Armenian          | 51  | 84  | Armenian (Armenia)         |
	 * | [-] ka_GE = ka = Georgian          | 52  | 85  | Georgian (Georgia)         |
	 * | [-]         mo = Moldavian         | 53  | -1  | Moldavian                  |
	 * | [-]         ky = Kirghiz           | 54  | -1  | Kyrgyz                     |
	 * | [-]         tg = Tajiki            | 55  | -1  | Tajik                      |
	 * | [-]         tk = Turkmen           | 56  | -1  | Turkmen                    |
	 * | [-]         mn = Mongolian         | 58  | -1  | Mongolian                  |
	 * | [-]         ps = Pashto            | 59  | -1  | Pashto                     |
	 * | [-]         ku = Kurdish           | 60  | -1  | Kurdish                    |
	 * | [-]         ks = Kashmiri          | 61  | -1  | Kashmiri                   |
	 * | [-]         sd = Sindhi            | 62  | -1  | Sindhi                     |
	 * | [-]         bo = Tibetan           | 63  | 105 | Tibetan                    |
	 * | [-] ne_NP = ne = Nepali            | 64  | 106 | Nepali (Nepal)             |
	 * | [-]         sa = Sanskrit          | 65  | -1  | Sanskrit                   |
	 * | [-] mr_IN = mr = Marathi           | 66  | 104 | Marathi (India)            |
	 * | [-]         bn = Bengali           | 67  | 60  | Bengali                    |
	 * | [-]         as = Assamese          | 68  | -1  | Assamese                   |
	 * | [-] gu_IN = gu = Gujarati          | 69  | 94  | Gujarati (India)           |
	 * | [-]         pa = Punjabi           | 70  | 95  | Punjabi                    |
	 * | [-]         or = Oriya             | 71  | -1  | Oriya                      |
	 * | [-]         ml = Malayalam         | 72  | -1  | Malayalam                  |
	 * | [-]         kn = Kannada           | 73  | -1  | Kannada                    |
	 * | [-]         ta = Tamil             | 74  | -1  | Tamil                      |
	 * | [-]         te = Telugu            | 75  | -1  | Telugu                     |
	 * | [-]         si = Sinhalese         | 76  | -1  | Sinhala                    |
	 * | [-]         my = Burmese           | 77  | -1  | Burmese                    |
	 * | [-]         km = Khmer             | 78  | -1  | Khmer                      |
	 * | [-]         lo = Lao               | 79  | -1  | Lao                        |
	 * | [-] vi_VN = vi = Vietnamese        | 80  | 97  | Vietnamese (Vietnam)       |
	 * | [-]         id = Indonesian        | 81  | -1  | Indonesian                 |
	 * | [-]         tl = Tagalog           | 82  | -1  | Tagalog                    |
	 * | [-]         ms = Malay             | 83  | -1  | Malay                      |
	 * | [-]         am = Amharic           | 85  | -1  | Amharic                    |
	 * | [-]         ti = Tigrinya          | 86  | -1  | Tigrinya                   |
	 * | [-]         om = Oromo             | 87  | -1  | Oromo                      |
	 * | [-]         so = Somali            | 88  | -1  | Somali                     |
	 * | [-]         sw = Swahili           | 89  | -1  | Swahili                    |
	 * | [-]         rw = Kinyarwanda       | 90  | -1  | Kinyarwanda                |
	 * | [-]         rn = Rundi             | 91  | -1  | Rundi                      |
	 * | [-]              Nyanja            | 92  | -1  | Nyanja                     |
	 * | [-]         mg = Malagasy          | 93  | -1  | Malagasy                   |
	 * | [-]         eo = Esperanto         | 94  | 103 | Esperanto                  |
	 * | [-]         cy = Welsh             | 128 | 79  | Welsh                      |
	 * | [-]         eu = Basque            | 129 | -1  | Basque                     |
	 * | [-] ca_ES = ca = Catalan           | 130 | 73  | Catalan (Spain)            |
	 * | [-]         la = Latin             | 131 | -1  | Latin                      |
	 * | [-]         qu = Quechua           | 132 | -1  | Quechua                    |
	 * | [-]         gn = Guarani           | 133 | -1  | Guarani                    |
	 * | [-]         ay = Aymara            | 134 | -1  | Aymara                     |
	 * | [-]         tt = Tatar             | 135 | -1  | Tatar                      |
	 * | [-]         ug = Uighur            | 136 | -1  | Uyghur                     |
	 * | [-] dz_BT = dz = Dzongkha          | 137 | 83  | Dzongkha (Bhutan)          |
	 * | [-]         jv = Javanese          | 138 | -1  | Javanese                   |
	 * | [-]         su = Sundanese         | 139 | -1  | Sundanese                  |
	 * | [-]         gl = Galician          | 140 | -1  | Galician                   |
	 * | [-] af_ZA = af = Afrikaans         | 141 | 102 | Afrikaans (South Africa)   |
	 * | [-]         br = Breton            | 142 | 77  | Breton                     |
	 * | [-] iu_CA = iu = Inuktitut         | 143 | 78  | Inuktitut (Canada)         |
	 * | [-]         gd = Scottish          | 144 | 75  | Scottish Gaelic            |
	 * | [-]         gv = Manx              | 145 | 76  | Manx                       |
	 * | [-] to_TO = to = Tongan            | 147 | 88  | Tongan (Tonga)             |
	 * | [-]         grc                    | 148 | 40  | Ancient Greek              |
	 * | [-]         kl = Greenlandic       | 149 | 107 | Kalaallisut                |
	 * | [-]         az = Azerbaijani       | 150 | -1  | Azerbaijani                |
	 *******************************************************************************************/
	public static Language = class
	{
		public static KO: string        = "ko";         // kor // Korea, Republic of
		public static EN: string        = "en";         // eng // United States of America
		public static JA: string        = "ja";         // jpn // Japan
		public static ZH_CN: string     = "zh_cn";      // zho // China
	};

	public static Country = class
	{
		public static KR: string    = "kr";     // Korea, Republic of
		public static US: string    = "us";     // United States of America
		public static JP: string    = "jp";     // Japan
		public static CN: string    = "cn";     // China
	};

	public static Localize = class
	{
		protected static ms_languageCode: string    = CLocalize.Language.KO;
		protected static ms_countryCode: string     = CLocalize.Country.KR;

		public static get getLanguageCode(): string
		{
			return this.ms_languageCode;
		}

		public static setLanguageCode(languageCode: string): void
		{
			this.ms_languageCode = languageCode;
		}

		public static get getCountryCode(): string
		{
			return this.ms_countryCode;
		}

		public static setCountryCode(countryCode: string): void
		{
			this.ms_countryCode = countryCode;
		}
	};
}
