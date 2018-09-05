/**
 * Created by kkuris on 2018-06-01.
 */


// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_FIT_ADA_CONN = global.MYSQL_CONNECTOR_POOLS.ADA;

exports.add_routes = function(app) {
    app.post("/ada/test/arrar", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};
            responseOBJ.testArrary = [];

            var testArrary = [];

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;


            MYSQL_FIT_ADA_CONN.procTestArr(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;

                for(var i = 0; i < len; i++){
                    var row = results[0][i];

                    var rES = {
                      itemID : row.ITEM_ID,
                      categoryID : row.CATEGORY_ID
                    };
                    // responseOBJ.testArrary[i] = row.ITEM_ID;
                    responseOBJ.testArrary.push(rES);
                }

                PACKET.sendSuccess(req, res, row.msg, responseOBJ)
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};