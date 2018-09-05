/**
 * Created by kkuris on 2018-04-11.
 */
/**
 * Created by kkuris on 2017-12-13.
 */

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");


var nodemailer = require('nodemailer');


// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_FIT_ADA_CONN = global.MYSQL_CONNECTOR_POOLS.ADA;

exports.add_routes = function(app) {
    app.post("/ada/etc/test", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var failResultMsg = "error!";
            CLIENT_IP.length > 0 ? PACKET.sendSuccess(req, res, 'success', {clientIP : CLIENT_IP}) : PACKET.sendFail(req, res, -1, failResultMsg, {});

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/ada/product/test", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { 
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            // var responseOBJ = {};
            var resArrary = [];
            // responseOBJ.property = "test";
            // responseOBJ.lisat = [];

            var path = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST + global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.PHOTO_PATH_BEGIN;

            console.log(path);


        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

};