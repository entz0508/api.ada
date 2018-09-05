/**
 * Created by kkuris on 2018-05-28.
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

exports.add_routes = function (app) {
    app.post("/ada/boutique/categoryList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT ?
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var randomGender;
            randomGender = parseInt(Math.random() * 2) + 1;
            var responseOBJ = {};


            responseOBJ.categoryList = [];

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.brandID = COMMON_UTIL.trim(req.body.brand_id);

            MYSQL_FIT_ADA_CONN.procCategoryList(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procCategoryList", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;
                if ((0 < results[0].length)) {
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        var categorylist = {
                            categoryID: row.CATEGORY_ID,
                            categoryName: row.CATEGORY_NAME,
                            gender: row.GENDER
                        };
                        responseOBJ.categoryList.push(categorylist);
                    }

                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
                } else
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

};