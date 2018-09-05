/**
 * Created by kkuris on 2018-06-05.
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
    app.post("/ada/boutique/brandList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT ?
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            responseOBJ.brandList = [];

            var failResultMsg = "error!";

            var randomGender;
            randomGender = parseInt(Math.random() * 2) + 1;

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender_id);

            MYSQL_FIT_ADA_CONN.procGetBrandList(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procCategoryList", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }


                var len = results[0].length;
                if ((0 < results[0].length)) {
                    for (var i = 0; i < len; i++) {
                        var row = results[0][i];

                        var brandlist = {
                            brandID: row.BRAND_ID,
                            brandName: row.BRAND_NAME,
                            brandImage: row.BRAND_IMAGE,
                            brandThumImage: row.THUM_IMAGE
                        };

                        responseOBJ.brandList.push(brandlist);
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

//    app.post("/ada/boutique/brandDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT ?
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            var requestParams = {};
//            var responseOBJ = {};
//
//            var randomGender;
//            randomGender = parseInt(Math.random()*2)+1;
//
//            responseOBJ.accountInfo = {
//                accountID: 100000003,
//                gender: 2,          //randomGender,
//                gold: 20000,
//                dia: 1000
//            };
//
//            responseOBJ.brandName = "";
//            responseOBJ.description = "";
//            responseOBJ.brandURL = "";
//            responseOBJ.brandImage = "";
//            responseOBJ.brandThumImage = "";
//            responseOBJ.likeCount= "";
//            responseOBJ.categoryList = [];
//
//            var failResultMsg = "error!";
//
//            requestParams.req = req;
//            requestParams.res = res;
//            requestParams.API_PATH = API_PATH;
//            requestParams.CLIENT_IP = CLIENT_IP;
//            requestParams.brandID = COMMON_UTIL.trim(req.body.brand_id);
//
//            MYSQL_FIT_ADA_CONN.procGetBrandDetail(requestParams, function(err, result) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetBrandDetail", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                    MYSQL_FIT_ADA_CONN.procCategoryList(requestParams, function (err, results) {
//                        if (err) {
//                            PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procCategoryList", err);
//                            return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                        }
//                        var len = results[0].length;
//                        if((0 < results[0].length)) {
//                            for (var i = 0; i < len; i++) {
//                                var row = results[0][i];
//
//                                var categoryInfo = {
//                                    categoryID: row.CATEGORY_ID,
//                                    categoryName: row.CATEGORY_NAME,
//                                    gender: row.GENDER
//                                };
//                                
//                                responseOBJ.categoryList.push(categoryInfo);
//                            }
//                           
//                            responseOBJ.brandName = result[0][0].brand_name;
//                            responseOBJ.description = result[0][0].description;
//                            responseOBJ.brandURL = result[0][0].brand_url;
//                            responseOBJ.brandImage = result[0][0].brand_image;
//                            responseOBJ.brandThumImage = result[0][0].thum_image;
//                            responseOBJ.likeCount= result[0][0].likeCount;
//
//                            PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//
//                        } else {
//                           
//                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
//                        } 
//                        
////                        else 
//                    });
//
//            });
//
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//        }
//    });


    app.post("/ada/boutique/brandDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //middleware LOGGED_IN_ACCOUNT ?
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            responseOBJ.brandName = "";
            responseOBJ.description = "";
            responseOBJ.brandURL = "";
            responseOBJ.brandImage = "";
            responseOBJ.brandThumImage = "";
            responseOBJ.likeCount = "";
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

                        var categoryInfo = {
                            categoryID: row.CATEGORY_ID,
                            categoryName: row.CATEGORY_NAME,
                            gender: row.GENDER
                        };

                        responseOBJ.categoryList.push(categoryInfo);
                    }
                }
                MYSQL_FIT_ADA_CONN.procGetBrandDetail(requestParams, function (err, result) {
                    if (err) {
                        PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetBrandDetail", err);
                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                    }
                    var len = result[0].length;
                    if ((0 < result[0].length)) {
                        for (var j = 0; j < len; j++) {
                            var row1 = result[0][j];

                            responseOBJ.brandName = row1.brand_name;
                            responseOBJ.description = row1.description;
                            responseOBJ.brandURL = row1.brand_url;
                            responseOBJ.brandImage = row1.brand_image;
                            responseOBJ.brandThumImage = row1.thum_image;
                            responseOBJ.likeCount = row1.likeCount;
                        }

                        PACKET.sendSuccess(req, res, 'search success', responseOBJ);
                    } else {
                        PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
                    }

                });
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


//    app.post("/ada/boutique/brandCategory", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT?
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            var requestParams = {};
//            var responseOBJ = {};
//            
//            responseOBJ.accountID = "";
//            responseOBJ.gold = "";
//            responseOBJ.dia = "";
//            responseOBJ.brandID = "";
//            responseOBJ.brandName = "";
//            responseOBJ.brandCategoryList = [];
//            
//            var failResultMsg = "error!";
//
//            requestParams.req = req;
//            requestParams.res = res;
//            requestParams.API_PATH = API_PATH;
//            requestParams.CLIENT_IP = CLIENT_IP;
//            requestParams.brandID = COMMON_UTIL.trim(req.body.brand_id);
//
//            MYSQL_FIT_ADA_CONN.procGetBrandCategory(requestParams, function(err, results) {
//                if (err) {
//                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procGetBrandPage", err);
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                }
//
//                var len = results[0].length;
//                if((0 < results[0].length)) {
//                    for (var i = 0; i < len; i++) {
//                        var row = results[0][i];
//                        responseOBJ.accountID = 100000003;
//                        responseOBJ.gold = 20000;
//                        responseOBJ.dia = 1000;
//                        responseOBJ.brandName = row.brand_name;
//                        responseOBJ.brandID = row.brand_id;
//
//                        // responseOBJ.pdtCount = results[0].length;
//                        //
//                        // var product = {
//                        //     productID: row.product_id,
//                        //     productName: row.product_name,
//                        //     payMethod : row.payMethod,
//                        //     productGender : row.productGender,
//                        //     productCategory: row.product_category,
//                        //     productImageURL: row.product_image,
//                        //     onSale: 'y',
//                        //     wish: 'y',
//                        //     price: row.price
//                        // };
//                        var categoryOBJ = {
//                          categoryID: row.category_id,
//                          categoryName: row.category_name
//                        };
//
//                        //
//                        responseOBJ.brandCategoryList.push(categoryOBJ);
//                    }
//
//                    PACKET.sendSuccess(req, res, 'search success', responseOBJ);
//                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
//
//            });
//
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//        }
//    });

};