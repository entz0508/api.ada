/**
 * Created by kkuris on 2018-05-04.
 */
/**
 * Created by kkuris on 2018-04-17.
 */

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_JSU_BOOK = global.MYSQL_CONNECTOR_POOLS.JSU_BOOK;

exports.add_routes = function(app) {
    app.post("/jsu/book/rent", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};

            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.bookID = COMMON_UTIL.trim(req.body.book_id);
            requestParams.clubID = COMMON_UTIL.trim(req.body.club_id);

            MYSQL_JSU_BOOK.procRentBook(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procRentBook", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                var row = results[0][0];

                if((0 < results[0].length)){

                    // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
                    PACKET.sendSuccess(req, res, row.MSG, {});
                } else
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/book/return", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};

            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.bookID = COMMON_UTIL.trim(req.body.book_id);
            requestParams.clubID = COMMON_UTIL.trim(req.body.club_id);


            MYSQL_JSU_BOOK.procReturnBook(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procReturnBook", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                var row = results[0][0];

                if((0 < results[0].length)){

                    // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
                    PACKET.sendSuccess(req, res, row.MSG, {});
                } else
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

};