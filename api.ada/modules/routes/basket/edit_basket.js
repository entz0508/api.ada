
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

exports.add_routes = function(app) {
    app.post("/ada/basket/edit", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var randomGender;
            randomGender = parseInt(Math.random()*2)+1;
            var responseOBJ = {};
            responseOBJ.accountInfo = {};
            responseOBJ.bannerList = [];

            var banner = {};

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;

            requestParams.placeID = COMMON_UTIL.trim(req.body.place_id);
            requestParams.brandID = COMMON_UTIL.trim(req.body.brand_id);
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender_id);
            requestParams.age = COMMON_UTIL.trim(req.body.age);

//            MYSQL_FIT_ADA_CONN.procGetBannerList(requestParams, function(err, results) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetBannerList", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                responseOBJ.accountInfo = {
//                    accountID: 100000003,
//                    gender: 2,                  // randomGender,
//                    gold: 20000,
//                    dia: 1000
//                };
//
//                if((0 < results[0].length)){
//                    for(var i = 0, len = results[0].length; i < len; i ++){
//                        var row = results[0][i];
//
//                        banner = {
//                            title: row.TITLE,
//                            imageURL: path + row.IMAGE_URL,
//                            contents_id: row.CONTENTS_ID,
//                            linkURL: row.LINK_URL
//                        };
//
//                        responseOBJ.bannerList.push(banner);
//                    }
//
//                    // PRINT_LOG.info(__filename, API_PATH, JSON.stringify(req.body));
//
//                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//                }
//                else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
//            });


        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/ada/basket/list", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var randomGender;
            randomGender = parseInt(Math.random()*2)+1;
            var responseOBJ = {};
            responseOBJ.accountInfo = {};
            responseOBJ.bannerList = [];

            var banner = {};

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;

            requestParams.placeID = COMMON_UTIL.trim(req.body.place_id);
            requestParams.brandID = COMMON_UTIL.trim(req.body.brand_id);
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender_id);
            requestParams.age = COMMON_UTIL.trim(req.body.age);

//            MYSQL_FIT_ADA_CONN.procGetBannerList(requestParams, function(err, results) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetBannerList", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                responseOBJ.accountInfo = {
//                    accountID: 100000003,
//                    gender: 2,                  // randomGender,
//                    gold: 20000,
//                    dia: 1000
//                };
//
//                if((0 < results[0].length)){
//                    for(var i = 0, len = results[0].length; i < len; i ++){
//                        var row = results[0][i];
//
//                        banner = {
//                            title: row.TITLE,
//                            imageURL: path + row.IMAGE_URL,
//                            contents_id: row.CONTENTS_ID,
//                            linkURL: row.LINK_URL
//                        };
//
//                        responseOBJ.bannerList.push(banner);
//                    }
//
//                    // PRINT_LOG.info(__filename, API_PATH, JSON.stringify(req.body));
//
//                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//                }
//                else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
//            });


        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


};