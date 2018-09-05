
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
// const MYSQL_FIT_ADA_CONN = global.MYSQL_CONNECTOR_POOLS.ADA;

exports.add_routes = function(app) {
    app.post("/ada/etc/test", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            
            var responseOBJ = {};
            
            responseOBJ.IMG_SERVER_URL = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST;
            responseOBJ.CLIENT_IP = CLIENT_IP;
            responseOBJ.API_PATH = API_PATH;

            PACKET.sendSuccess(req, res, 'search success', responseOBJ);

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};