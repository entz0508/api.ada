/**
 * Created by kkuris on 2018-05-29.
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
const MYSQL_FIT_ADA_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.ADA_Account;

exports.add_routes = function (app) {
//    app.post("/ada/dressRoom/list", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT ?
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            var requestParams = {};
//            var responseOBJ = {};
//            responseOBJ.categoryList = [];
//            // responseOBJ.categoryList = [];
//
//            var failResultMsg = "error!";
//
//            requestParams.req = req;
//            requestParams.res = res;
//            requestParams.API_PATH = API_PATH;
//            requestParams.CLIENT_IP = CLIENT_IP;
//
//            MYSQL_FIT_ADA_CONN.procDressRoom(requestParams, function (err, results) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procDressRoom", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                var len = results[0].length;
//                if ((0 < results[0].length)) {
//                    for (var i = 0; i < len; i++) {
//                        var row = results[0][i];
//
//                        var categorylist = {
//                            categoryID: row.category_id,
//                            categoryName: row.category_name,
//                            count: 1,
//                            newIco: "y"
//                        };
//                        responseOBJ.categoryList.push(categorylist);
//                    }
//
//                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//                } else
//                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
//
//            });
//
//
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//        }
//    });
//
//
//    app.post("/ada/dressRoom/detail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT ?
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            var requestParams = {};
//            var responseOBJ = {};
//
//            responseOBJ.accountID = 100000003;
//            responseOBJ.gold = 20000;
//            responseOBJ.dia = 1000;
//            responseOBJ.pdtDetail = [];
//
//            var failResultMsg = "error!";
//
//            requestParams.req = req;
//            requestParams.res = res;
//            requestParams.API_PATH = API_PATH;
//            requestParams.CLIENT_IP = CLIENT_IP;
//            requestParams.categoryID = COMMON_UTIL.trim(req.body.category_id);
//
//            MYSQL_FIT_ADA_CONN.procDressRoomDetail(requestParams, function (err, results) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procDressRoomDetail", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                var len = results[0].length;
//                if ((0 < results[0].length)) {
//                    for (var i = 0; i < len; i++) {
//                        var row = results[0][i];
//
//                        var itemDetail = {
//                            itemID: row.item_id,
//                            brandID: row.brand_id,
//                            categoryName: row.category_name,
//                            brandLogo: row.thum_image,
//                            pdtImage: row.attach_path,
//                            newIco: "y"
//                        };
//                        responseOBJ.pdtDetail.push(itemDetail);
//                    }
//
//                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//                } else
//                    PACKET.sendSuccess(req, res, 'the closet is empty', {});
//
//            });
//
//
//            // MYSQL_FIT_ADA_CONN.procDressRoomDetail(requestParams, function(err, results) {
//            //     if (err) {
//            //         PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procDressRoomDetail", err);
//            //         return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//            //     }
//            //
//            //     var len = results[0].length;
//            //     if((0 < results[0].length)) {
//            //         for (var i = 0; i < 3; i++) {
//            //             var row = results[0][i];
//            //
//            //             var itemDetail = {
//            //                 // itemID: row.item_id,
//            //                 // brandID: row.brand_id,
//            //                 // brandLogo: row.thum_image,
//            //                 // pdtImage: row.attach_path
//            //                 itemID: 1,
//            //                 brandID: 2,
//            //                 brandLogo: "dfdfdf",
//            //                 pdtImage: "asdfasdfasdf"
//            //             };
//            //             responseOBJ.pdtDetail.push(itemDetail);
//            //         }
//
//            // PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//            // } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, 'the closet is empty', {});
//
//            // });
//
//
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//        }
//    });

    app.post("/ada/dressRoom/menu", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) { //로그인 한 계정과 현재 캐릭터 상태 responseOBJ로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
            var requestParams = {};
            var responseOBJ = {};
//            responseOBJ.userStat = {};
//            
//            responseOBJ.avatarInfo = {};
            

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.accountID = accountID;
            

             MYSQL_FIT_ADA_ACCOUNT_CONN.procDressRoom(requestParams, function(err, results) {
                 if (err) {
                     PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procDressRoomDetail", err);
                     return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                 }
            
                 var len = results[0].length;
                 if((0 < results[0].length)) {
                     for (var i = 0; i < len; i++) {
                         var row = results[0][i];
                         responseOBJ.userStat = {
                             signupID : row.SIGNUP_ID,
                             signupPath : row.SIGNUP_PATH,
                             nickName : row.NICK_NAME,
                             gender : row.GENDER,
                             country : row.COUNTRY
                         };
                         
                         responseOBJ.avatarInfo = {
                             head : row.B_HEAD,
                             hair : row.B_HAIR,
                             armB : row.B_ARMB,
                             armL : row.B_ARML,
                             legB : row.B_LEGB,
                             legL : row.B_LEGL,
                             skin : row.B_SKIN,
                             top : row.C_TOP,
                             bottom : row.C_BOTTOM,
                             shoes : row.C_SHOES
                         };
                         
                         
                     }
            
                     PACKET.sendSuccess(req, res, 'search success', responseOBJ);
                 } else PACKET.sendSuccess(req, res, 'the closet is empty', {});
            
             });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


};