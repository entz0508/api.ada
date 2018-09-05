/**
 * Created by kkuris on 2018-06-14.
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

const path = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST + global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.PHOTO_PATH_BEGIN;

exports.add_routes = function (app) {
    app.post("/ada/boutique/contentsView", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.contentID = COMMON_UTIL.trim(req.body.content_id);

            MYSQL_FIT_ADA_CONN.procGetContentsView(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetContentsView", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if ((0 < results[0].length)) {
                    for (var i = 0, len = results[0].length; i < len; i++) {
                        var row = results[0][i];

                        responseOBJ.contents = row.CONTENTS;

                    }
                    PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
                } else
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
            });


        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


};