/**
 * Created by kkuris on 2018-06-20.
 */
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

// image Path
const path = global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.HOST + global.CONFIG.SERVER_INFO.PHOTO.IMG_SERVER_ADA_DEV.PHOTO_PATH_BEGIN;

exports.add_routes = function(app) {

    app.post("/ada/cart/edit", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var responseOBJ = {};
            var info = {};
            responseOBJ.userStat = {};
            responseOBJ.itemInfo = {};
            responseOBJ.itemInfo.productCount = '';
            responseOBJ.itemInfo.productList = [];
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
//            var cartCount;
            var requestParams = {
                accountID: accountID,
                saleID: COMMON_UTIL.trim(req.body.sale_id),
                subitemID: COMMON_UTIL.trim(req.body.subitem_id),
                actionType: COMMON_UTIL.trim(req.body.action_type)
            };
            
            //PRINT_LOG.info(__filename, API_PATH, "RES >>"+ JSON.stringify(requestParams));
            MYSQL_FIT_ADA_CONN.procCartEdit(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procCartEdit", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var row = results[0][0];
                
                responseOBJ.userStat = {
                    cartCount: row.CART
                };
                
//                var len = results[1].length;
//                for(var i = 0; i < len; i++){
                    info = {};
                    info.saleID = COMMON_UTIL.trim(req.body.sale_id);
                    info.subItemID = COMMON_UTIL.trim(req.body.subitem_id);
                    
                    responseOBJ.itemInfo.productList.push(info);
//                }
                
                responseOBJ.itemInfo.productCount = responseOBJ.itemInfo.productList.length;
                
                if(row.RES == 0){
                     PACKET.sendSuccess(req, res, row.MSG + " : " + row.RES, responseOBJ);

                }else{
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG + ":" + row.RES, responseOBJ);

                }
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });
    
    app.post("/ada/cart/delete", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
            var cartID = (req.body.cart_id) ? COMMON_UTIL.trim(req.body.cart_id) : 0;
            var responseOBJ = {};
            var info = {};
            responseOBJ.userStat = {};
            responseOBJ.itemInfo = {};
            responseOBJ.itemInfo.productCount = '';
            responseOBJ.itemInfo.productList = [];

            var cartCount;
            var requestParams = {
                accountID: accountID,
                cartID: cartID
            };
            
            // PRINT_LOG.info(__filename, API_PATH, "RES >>"+ JSON.stringify(requestParams));
            MYSQL_FIT_ADA_CONN.procCartDelete(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procCartDelete", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var row = results[0][0];
                responseOBJ.userStat = {
                    cartCount: row.CART
                };
                info = {};
                info.dropID = row.DROP_ID;
                info.saleID = row.SALE_ID;
                info.subItemID = row.SUBITEM_ID;
                responseOBJ.itemInfo.productList.push(info);
               
                responseOBJ.itemInfo.productCount = (row.DROP_ID > 0) ? 1 : 0;           //  responseOBJ.itemInfo.productList.length;

                if(row.RES == 0){
                     PACKET.sendSuccess(req, res, row.MSG + " : " + row.RES, responseOBJ);
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG + ":" + row.RES, responseOBJ);
                }
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });

    app.post("/ada/cart/list", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //middleware LOGGED_IN_ACCOUNT?
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
            
            var requestParams = {};
            var responseOBJ = {};
            responseOBJ.cartList = [];

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            
//            requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
            requestParams.accountID = accountID;
            requestParams.searchType = COMMON_UTIL.trim(req.body.search_type);
            requestParams.pageVal = COMMON_UTIL.trim(req.body.page_val);
            requestParams.appendVal = COMMON_UTIL.trim(req.body.append_val);
            
            MYSQL_FIT_ADA_CONN.procCartList(requestParams, function (err, results) {
                 if (err) {
                     PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procCategoryList", err);
                     return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                 }
                 var len = results[1].length;
                 var cartList = {};
                 cartList.count = results[0].searchCnt;
                 if((0 < results[0].length)) {
                     for (var i = 0; i < len; i++) {
                         
                         var row1 = results[1][i];
                         
                            cartList.cartID = row1.CART_ID;
                            cartList.saleID = row1.SALE_ID;
                            cartList.saveType = row1.SAVE_TYPE;
                            cartList.itemID = row1.ITEM_ID;
                            cartList.saleName = row1.SALE_NAME;
                            cartList.priceType = row1.PRICE_TYPE;
                            cartList.price = row1.PRICE;
                            cartList.regDateTime = row1.REG_DATETIME;
                            cartList.brandName = row1.brand_name;
                            cartList.itemImage = path + row1.item_image;
                            cartList.colorID = row1.COLOR_ID;
                            cartList.colorName = row1.CODE_NAME;
                            cartList.codeValue = row1.CODE_VALUE;
                            cartList.saleType = row1.SALE_TYPE;
                         
                        responseOBJ.cartList.push(cartList);
                        
                        cartList = {};
                        
                     }
            
                     PACKET.sendSuccess(req, res, 'search success', responseOBJ);
          
                 } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, failResultMsg, {});
             });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
    
    app.post("/ada/cart/buyAll", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
            var responseOBJ = {};
            responseOBJ.userStat = {};
            responseOBJ.itemInfo = {};
            var info = {};
            responseOBJ.itemInfo.productCount = '';
            responseOBJ.itemInfo.productList = [];
            
            var requestParams = {
                accountID: accountID,
                cartIDs: COMMON_UTIL.trim(req.body.cart_ids)
            };
            
            //PRINT_LOG.info(__filename, API_PATH, "RES >>"+ JSON.stringify(requestParams));
            MYSQL_FIT_ADA_CONN.procBuyAll(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_ADA.procBuyAll", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var row = results[0][0];
                
                responseOBJ.userStat = {
                    cartCount: row.CART
                };
                
                var len = results[1].length;
                for(var i = 0; i < len; i ++){
                    var row1 = results[1][i];
                    
                    info = {};
                    info.cartID = row1.CART_ID;
                    info.saleID = row1.SALE_ID;
                    info.subItemID = row1.SUBITEM_ID;
                    
                    responseOBJ.itemInfo.productList.push(info);
                }
                
                responseOBJ.itemInfo.productCount = responseOBJ.itemInfo.productList.length;
                    
                
                if(row.RES == 0){
                    PACKET.sendSuccess(req, res, row.MSG + " : " + row.RES, responseOBJ);

                }else{
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG + ":" + row.RES, responseOBJ);

                }
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});

        }
    });
};