// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_ADB_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.ADB_ACCOUNT;

exports.add_routes = function (app) {

    // function checkParams(API_PATH, clientUID, accountID, accessToken, profileID) {
    function checkParams(API_PATH, clientUID, accessToken) {
        var errParam;
        //if (!COMMON_UTIL.isNumber(accountID)) errParam = "accountID";
		if (!COMMON_UTIL.isValidClientUID(clientUID)) errParam = "clientUID";
		if (!COMMON_UTIL.isValidAccessToken(accessToken)) errParam = "accessToken";
		if (errParam) PRINT_LOG.error(__filename, API_PATH, " error parameter " + errParam);
		return !errParam;
	}

    // app.post("/adb/account/isloggedin/with", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_USER_ALLOW_APP, function(req, res) {
	app.post("/adb/account/isloggedin/with", ROUTE_MIDDLEWARE.AUTH_APP_LOGIN_USER_ALLOW_APP, function(req, res) {
		var API_PATH = req.route.path;
		try {
			//var appID = COMMON_UTIL.trim(req.body.app_id);
			var clientUID = COMMON_UTIL.trim(req.body.client_uid);
			//var accountID = COMMON_UTIL.trim(req.body.account_id);
			var accessToken = COMMON_UTIL.trim(req.body.access_token);
			//var profileID = COMMON_UTIL.trim(req.body.pf_id);

			//if (!checkParams(API_PATH, appID, clientUID, accountID, accessToken, profileID)) {
            if (!checkParams(API_PATH, clientUID, accessToken)) {
                PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
				return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
			}
            //MYSQL_ADB_ACCOUNT_CONN.procIsLoginUserAccountWithProfileID(appID, clientUID, accountID, accessToken, profileID, function(err, results) {
            MYSQL_ADB_ACCOUNT_CONN.procIsLoginUserAccount(clientUID, accessToken, function (err, results) {
                //PRINT_LOG.info(__filename, API_PATH, "procIsLoginUserAccount results : " + JSON.stringify(results));
                // {"RES":0,"IS_LOGIN":1}

				if (err) {
					PRINT_LOG.error(__filename, API_PATH, " procUserAccountLogin, faile db, error");
					return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
				}
                
				//var retV = COMMON_UTIL.getMysqlRES(results);
				//if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
				//	PRINT_LOG.error(__filename, API_PATH, retV.msg);
				//	return PACKET.sendFail(req, res, retV.res);
				//}

                var row = results[0][0];
                if (row.RES === 0) {
                    var isLogin = (1 === Number(row.IS_LOGIN)) ? 1 : 0;      //Number(row.IS_LOGIN);
                    //PRINT_LOG.info(__filename, API_PATH, " procIsLoginUserAccount, row.IS_LOGIN : " + isLogin);
                    PACKET.sendSuccess(req, res, row.RES, { is_logged_in: isLogin, is_accountID: row.IS_AccountID });
                } else {
                    PRINT_LOG.error(__filename, API_PATH, " procIsLoginUserAccount, faile db, error");
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, "procIsLoginUserAccount, faile", {});
                }
			});
		} catch (catchErr) {
			PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
			PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
		}
	});
};