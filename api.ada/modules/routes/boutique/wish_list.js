/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
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

const path = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST + global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.PHOTO_PATH_BEGIN;

// testtestteststest
exports.add_routes = function (app) {
    app.post("/ada/wish/list", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

            var requestParams = {};
            var responseOBJ = {};
            responseOBJ.wishList = [];
            requestParams.accountID = accountID;

            MYSQL_FIT_ADA_CONN.procWishList2(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procWishList", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[1].length;
                var list = {};
                list.count = results[0].searchCnt;

                if (results[1].length > 0) {
                    for (var i = 0; i < len; i++) {
                        var row = results[1][i];

                        list.saleID = row.SALE_ID;
                        list.productImage = path + row.item_image;
                        list.productImageWidth = row.item_image_w;
                        list.productImageHeight = row.item_image_h;
                        list.productName = row.item_name;
                        list.brandName = row.brand_name;
                        list.price = row.price;
                        list.payMehtod = row.price_type;
                        list.regDateTime = row.REG_DATETIME;
                        list.saleType = row.sale_type;

                        responseOBJ.wishList.push(list);

                        list = {};
                    }

                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
                } else {
                    var msg = "list is empty";
                    PACKET.sendSuccess(req, res, msg, {});
                }

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });


    app.post("/ada/wish/edit", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

            var requestParams = {
                accountID: accountID,
                saleID: COMMON_UTIL.trim(req.body.sale_id),
                wishType: COMMON_UTIL.trim(req.body.wish_type)
            };

            var saleID;
            saleID = requestParams.saleID;

            //PRINT_LOG.info(__filename, API_PATH, "RES >>"+ JSON.stringify(requestParams));

            MYSQL_FIT_ADA_CONN.procWishEdit(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procWishEdit", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var row = results[0][0];
                PRINT_LOG.info(__filename, API_PATH, "RES >>" + results[0][0].RES);

                if (row.RES == 0) {
                    var wishInfo = {
                        isWish: row.wished,
                        saleID: saleID
                    };
                    PACKET.sendSuccess(req, res, 'wish is edit', {wishInfo: wishInfo});
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG + ":" + row.RES, {});
                }
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });

    app.post("/ada/like/edit", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
            var saleID = (req.body.sale_id) ? COMMON_UTIL.trim(req.body.sale_id) : 0;
            var requestParams = {
                accountID: accountID,
                saleID: COMMON_UTIL.trim(req.body.sale_id),
                likeType: COMMON_UTIL.trim(req.body.like_type)
            };

            //PRINT_LOG.info(__filename, API_PATH, "RES >>"+ JSON.stringify(requestParams));
            MYSQL_FIT_ADA_CONN.procLikeEdit(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procLikeEdit", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var row = results[0][0];
                PRINT_LOG.info(__filename, API_PATH, "RES >>" + results[0][0].RES);

                if (row.RES == 0) {
                    var likeInfo = {
                        isLike: row.liked,
                        saleID: saleID,
                        count: row.count
                    };
                    PACKET.sendSuccess(req, res, row.MSG, {likeInfo: likeInfo});
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG + ":" + row.RES, {});
                }
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });
};