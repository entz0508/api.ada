﻿/**
 * Created by kkuris on 2018-05-16.
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

var path = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST + global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.PHOTO_PATH_BEGIN;

exports.add_routes = function (app) {
    app.post("/ada/boutique/featuredList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};

            var responseOBJ = {};

            responseOBJ.featuredList = [];

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender_id);

            MYSQL_FIT_ADA_CONN.procGetFeaturedList(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetFeaturedList", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }


                var len = results[0].length;
                if ((0 < results[0].length)) {
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        var featuredlist = {
                            featuredID: row.FEATURED_ID,
                            title: row.TITLE,
                            message: row.MESSAGE,
                            cover_image: path + row.COVER_IMAGE,
                            tagCount: row.tagCnt
                        };
                        responseOBJ.featuredList.push(featuredlist);
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

    app.post("/ada/boutique/featuredDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var responseOBJ = {};

            var requestParams = {};
            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.featuredID = COMMON_UTIL.trim(req.body.featured_id);

            MYSQL_FIT_ADA_CONN.procGetFeaturedDetail(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetFeaturedDetail", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;
                if ((0 < results[0].length)) {
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        // responseOBJ = {};
                        responseOBJ.header = row.HEADER;
                        responseOBJ.contents = row.CONTENTS;
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