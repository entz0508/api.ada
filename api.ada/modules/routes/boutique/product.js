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

exports.add_routes = function (app) {

    app.post("/ada/boutique/productList", ROUTE_MIDDLEWARE.NOLOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

            var requestParams = {};

            var responseOBJ = {};
            responseOBJ.productCount = "";

            responseOBJ.itemList = [];

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.searchType = COMMON_UTIL.trim(req.body.search_type);
            requestParams.categoryVal = COMMON_UTIL.trim(req.body.cate_val);
            requestParams.subcategoryVal = COMMON_UTIL.trim(req.body.subcate_val);
            requestParams.collecionVal = COMMON_UTIL.trim(req.body.collection_val);
            requestParams.brandVal = COMMON_UTIL.trim(req.body.brand_val);
            requestParams.styleVal = COMMON_UTIL.trim(req.body.style_val);
            requestParams.featuredVal = COMMON_UTIL.trim(req.body.featured_val);
            requestParams.colorVal = COMMON_UTIL.trim(req.body.color_val);
            requestParams.sortType = COMMON_UTIL.trim(req.body.sort_type);
            requestParams.pageVal = COMMON_UTIL.trim(req.body.page_val);
            requestParams.appendVal = COMMON_UTIL.trim(req.body.append_val);
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender);         //responseOBJ.accountInfo.gender;
            requestParams.accountID = accountID;

            MYSQL_FIT_ADA_CONN.procBoutiqueMain(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                responseOBJ.productCount = results[0][0].searchCnt;
                PRINT_LOG.info(__filename, API_PATH, JSON.stringify(req.body));
                //PRINT_LOG.info(__filename, API_PATH, "RES >>"+results[0][0].RES);

                if (results[0][0].RES == 0) {
                    if ((0 < results[1].length)) {
                        for (var k = 0, len2 = results[1].length; k < len2; k++) {
                            var row2 = results[1][k];

                            var product = {
                                productID: row2.product_id,
                                productName: row2.product_name,
                                productImage: path + row2.product_image,
                                productImageWidth: row2.product_image_width,
                                productImageHeight: row2.product_image_height,
                                payMethod: row2.payMethod,
                                brandID: row2.BRAND_ID,
                                brandName: row2.BRAND_NAME,
                                price: row2.PRICE,
                                saleType: row2.SALE_TYPE,
                                liked: row2.liked,
                                wished: row2.wished,
                                cartType: row2.cartType
                            };

                            // responseOBJ.tagList.push(productTags);
                            responseOBJ.itemList.push(product);
                        }
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

    app.post("/ada/boutique/productDetail", ROUTE_MIDDLEWARE.NOLOGGED_IN_ACCOUNT, function (req, res) { //middleware  LOGGED_IN_ACCOUNT - NO_AUTH_APP 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

            var requestParams = {};

            var responseOBJ = {};

            responseOBJ.itemDetail = {};
            responseOBJ.pdtOption = [];
            responseOBJ.tagList = [];
            var failResultMsg = "error!";

            var pdtOption = {
                subitemID: "",
                colorID: "",
                codeName: "",
                codeValue: "",
                codeImage: "",
                attachList: []
            };

            var attachOption = {
                attachType: "",
                attachPath: ""
            };

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;

            requestParams.salesID = COMMON_UTIL.trim(req.body.sales_id);
            requestParams.accountID = accountID;
            requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
            requestParams.os = COMMON_UTIL.trim(req.body.os);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if ((0 < results[0].length)) {

                    responseOBJ.itemDetail.saleID = results[0][0].SALE_ID;
                    responseOBJ.itemDetail.pdtID = results[0][0].ITEM_ID;
                    responseOBJ.itemDetail.pdtName = results[0][0].SALE_NAME;
                    responseOBJ.itemDetail.payMethod = results[0][0].PRICE_TYPES;
                    responseOBJ.itemDetail.price = results[0][0].PRICES;
                    responseOBJ.itemDetail.expPoint = results[0][0].EXP_POINT;
                    responseOBJ.itemDetail.introduction = results[0][0].INTORDUCTION;
                    responseOBJ.itemDetail.moreIntroduction = results[0][0].MOREINFOMATION;
                    responseOBJ.itemDetail.discountRatio = results[0][0].DIS_RATIO;
                    responseOBJ.itemDetail.buyLink = results[0][0].ONLINE_LINK;
                    responseOBJ.itemDetail.brandID = results[0][0].BRAND_ID;
                    responseOBJ.itemDetail.brandName = results[0][0].BRAND_NAME;
                    responseOBJ.itemDetail.likeCount = results[0][0].likeCount;
                    responseOBJ.itemDetail.liked = results[0][0].liked;
                    responseOBJ.itemDetail.wished = results[0][0].wished;
                    responseOBJ.itemDetail.cartType = results[0][0].cartType;
                }
                // test
                if ((0 < results[1].length)) {

                    for (var i = 0, len = results[1].length; i < len; i++) {
                        var row = results[1][i];

                        if (pdtOption.subitemID !== row.SUBITEM_ID) {

                            pdtOption = {
                                subitemID: row.SUBITEM_ID,
                                colorID: row.COLOR_ID,
                                codeName: row.CODE_NAME,
                                codeValue: row.CODE_VALUE,
                                codeImage: path + row.CODE_IMAGE, // 리스트 이미지
                                attachList: []
                            };

                            responseOBJ.pdtOption.push(pdtOption);
                        }
                        attachOption = {
                            attachType: row.ATTACH_TYPE,
                            attachThum: path + "thum/" + row.ATTACH_PATH, // 썸네일
                            attachPath: path + row.ATTACH_PATH                       // 클릭시 이미지
                        };

                        pdtOption.attachList.push(attachOption);

                        // responseOBJ.pdtColor.push(pdtOption);


                    }

                }

                if ((0 < results[2].length)) {
                    for (var j = 0, len2 = results[2].length; j < len2; j++) {
                        var row2 = results[2][j];

                        var tagOBJ = {
                            tagType: row2.tag_type,
                            tagValue: row2.tag_value,
                            tagName: row2.tag_str
                        };

                        responseOBJ.tagList.push(tagOBJ);

                    }
                }
//                PRINT_LOG.info(__filename,API_PATH,JSON.stringify(req.body));
                PRINT_LOG.info(__filename, API_PATH, JSON.stringify(responseOBJ.itemDetail));

                PACKET.sendSuccess(req, res, 'search success', responseOBJ);

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/ada/boutique/tagList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            responseOBJ.tagList = []; //태그 리스트

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            requestParams.searchType = COMMON_UTIL.trim(req.body.search_type);
            requestParams.categoryVal = COMMON_UTIL.trim(req.body.cate_val);
            requestParams.subcategoryVal = COMMON_UTIL.trim(req.body.subcate_val);
            requestParams.collecionVal = COMMON_UTIL.trim(req.body.collection_val);
            requestParams.brandVal = COMMON_UTIL.trim(req.body.brand_val);
            requestParams.styleVal = COMMON_UTIL.trim(req.body.style_val);
            requestParams.colorVal = COMMON_UTIL.trim(req.body.color_val);
            requestParams.featuredVal = COMMON_UTIL.trim(req.body.featured_val);
            requestParams.genderID = COMMON_UTIL.trim(req.body.gender);

            MYSQL_FIT_ADA_CONN.procSaleTagList(requestParams, function (err, result) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procSaleTagList", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if (result[0][0].RES === 0) {

                    for (var i = 0, len = result[1].length; i < len; i++) {
                        var row = result[1][i];

                        var tagOBJ = {
                            tagType: row.TAG_TYPE,
                            tagValue: row.TAG_VALUE,
                            tagName: row.TAG_STR,
                            check: row.CHECKED
                        };

//                        PRINT_LOG.info(__filename, API_PATH, JSON.stringify(req.body));
                        responseOBJ.tagList.push(tagOBJ);

                    }
                }
                PACKET.sendSuccess(req, res, 'search success', responseOBJ);
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};