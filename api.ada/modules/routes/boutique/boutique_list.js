/**
 * Created by kkuris on 2018-05-14.
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

exports.add_routes = function(app) {
   // app.post("/ada/boutique/productList", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
   //     var API_PATH = req.route.path;
   //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
   //     try {
   //         var requestParams = {};
   //         var responseOBJ = {};
   //
   //         responseOBJ.accountID = "";
   //         responseOBJ.gender = "";
   //         responseOBJ.gold = "";
   //         responseOBJ.dia = "";
   //         responseOBJ.productCount = "";
   //         responseOBJ.tagList = [];
   //         responseOBJ.boutiqueList = [];
   //         // responseOBJ.tags = [];
   //
   //         var failResultMsg = "error!";
   //
   //         requestParams.req = req;
   //         requestParams.res = res;
   //         requestParams.API_PATH = API_PATH;
   //         requestParams.CLIENT_IP = CLIENT_IP;
   //
   //         requestParams.os = COMMON_UTIL.trim(req.body.os);
   //
   //
   //         MYSQL_FIT_ADA_CONN.procBoutiqueMain(requestParams, function(err, results) {
   //             if (err) {
   //                 PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
   //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
   //             }
   //             if((0 < results[0].length)){
   //                 for(var i = 0, len = results[0].length; i < len; i ++){
   //                     var row = results[0][i];
   //
   //                     responseOBJ.accountID = 100000003;
   //                     responseOBJ.gender = 2;
   //                     responseOBJ.gold = 10000;
   //                     responseOBJ.dia = 2000;
   //                     responseOBJ.productCount = results[0].length; //row 값으로 상품 카운트 가지고 와야함
   //                     responseOBJ.tagList = [];
   //                     //
   //                     var productTags = {
   //                            tag_value: row.tag_value
   //                     };
   //
   //                     var product = {
   //                         productID: row.product_id,
   //                         productName: row.product_name,
   //                         payMethod : row.payMethod,
   //                         productGender : row.productGender,
   //                         productCategory: row.product_category,
   //                         productImageURL: path + row.product_image,
   //                         onSale: 'y',
   //                         brandID : row.brandID,
   //                         brandLogo: row.brand_logo,
   //                         wish: 'y',
   //                         price: row.price
   //                     };
   //
   //                     responseOBJ.tagList.push(productTags);
   //                     responseOBJ.boutiqueList.push(product);
   //
   //                 }
   //                 PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
   //             }
   //             else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '검색 결과가 없습니다.', {});
   //         });
   //
   //
   //     } catch (catchErr) {
   //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
   //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
   //     }
   // });
   //
   //  app.post("/ada/boutique/search", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
   //      var API_PATH = req.route.path;
   //      var CLIENT_IP = COMMON_UTIL.getClientIP(req);
   //      try {
   //
   //          var requestParams = {};
   //          var responseOBJ = {};
   //
   //          requestParams.keyword = COMMON_UTIL.trim(req.body.keyword);
   //
   //          MYSQL_FIT_ADA_CONN.procBoutiqueSearch(requestParams, function (err, results) {
   //              if (err) {
   //                  PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueSearch", err);
   //                  return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
   //              }
   //              if((0 < results[0].length)){
   //              var keyword = requestParams.keyword; // 입력된 태그 키워드가 DB상 존재하여야 하며 존재 시에는 결과값으로 노출 되어야 함
   //
   //
   //              MYSQL_FIT_ADA_CONN.procBoutiqueSearchResult(requestParams, function (err, resultes) { // DB 프로시져 컨넥터를 두개를 사용할 지, 프로시져 가 프로시져를 호출 할 지..
   //                  if(err){
   //                      PRINT_LOG.setErrorLog("Failed,, MYSQL_FIT_ADA_CONN.procBoutiqueSearchResult", err);
   //                      return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
   //                  }
   //                  if((0 < results[0].length)){
   //                      requestParams.keyword = keyword;
   //
   //                      responseOBJ.keyword = requestParams.keyword;
   //                      responseOBJ.accountID = "";
   //                      responseOBJ.gold = "";
   //                      responseOBJ.dia = "";
   //                      responseOBJ.productID = "";
   //                      responseOBJ.productName = "";
   //                      responseOBJ.brandName = "";
   //                      responseOBJ.brandLogo = "";
   //                      responseOBJ.sale = "";
   //                      responseOBJ.productIMG = "";
   //                      responseOBJ.wish = "";
   //                      responseOBJ.price = "";
   //
   //                  }
   //              })
   //
   //              } PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, 'search error', {});
   //          })
   //
   //
   //      } catch (catchErr) {
   //          PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
   //          PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
   //      }
   //  });
   //
   //  app.post("/ada/boutique/addTag", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //client 에서 각 카테고리 별 추가 된 태그 value 값들을 서버로 전송해줄지?
   //      var API_PATH = req.route.path;
   //      var CLIENT_IP = COMMON_UTIL.getClientIP(req);
   //      try {
   //
   //          var requestParams = {};
   //          var responseOBJ = {};
   //
   //          requestParams.keyword = COMMON_UTIL.trim(req.body.keyword);
   //
   //          MYSQL_FIT_ADA_CONN.procBoutiqueSearch(requestParams, function (err, results) {
   //              if (err) {
   //                  PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueSearch", err);
   //                  return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
   //              }
   //              if((0 < results[0].length)){
   //
   //
   //
   //              } PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, 'search error', {});
   //          })
   //
   //
   //      } catch (catchErr) {
   //          PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
   //          PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
   //      }
   //  });
   //
//     app.post("/ada/boutique/main", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
//         var API_PATH = req.route.path;
//         var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//         try {
//             var requestParams = {};
//             var responseOBJ = {};
//
//             responseOBJ.accountID = "";
//             responseOBJ.gender = "";
//             responseOBJ.gold = "";
//             responseOBJ.dia = "";
//             responseOBJ.productCount = "";
//             responseOBJ.boutiqueList = [];
//             // responseOBJ.tags = [];
//
//             var failResultMsg = "error!";
//
//             requestParams.req = req;
//             requestParams.res = res;
//             requestParams.API_PATH = API_PATH;
//             requestParams.CLIENT_IP = CLIENT_IP;
//
//             requestParams.os = COMMON_UTIL.trim(req.body.os);
// //            requestParams.pdt_id = COMMON_UTIL.trim(req.body.pdt_id);
//
//             MYSQL_FIT_ADA_CONN.procBoutiqueMain(requestParams, function(err, results) {
//                 if (err) {
//                     PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
//                     return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                 }
//
//                 var product = {};
//                 product.pdtID = "";
//                 product.pdtName = "";
//                 product.payMethod = "";
//                 product.pdtGender = "";
//                 product.pdtCategory = "";
//                 product.pdtImageURL = "";
//                 product.onSale = "";
//                 product.brandID = "";
//                 product.brandLogo = "";
//                 product.wish = "";
//                 product.price = "";
//                 product.tagList = [];
//
//                 if((0 < results[0].length)){
//                     for(var i = 0, len = results[0].length; i < len; i ++){
//                         var row = results[0][i];
//
//                         var tagOBJ = {};
//                         tagOBJ.tag_value = row.tag_value;
//
//                         responseOBJ.accountID = 100000003;
//                         responseOBJ.gender = 2;
//                         responseOBJ.gold = 10000;
//                         responseOBJ.dia = 2000;
//
//                         responseOBJ.productCount = results[0].length; //row 값으로 상품 카운트 가지고 와야함
//                         responseOBJ.boutiqueList = [];
//
//                         if(tagOBJ.tag_value === row.tag_value){
//                             product.pdtID = row.product_id;
//                             product.pdtName = row.product_name;
//                             product.payMethod = row.payMethod;
//                             product.pdtGender = row.productGender;
//                             product.pdtCategory = row.product_category;
//                             product.pdtImageURL = row.product_image;
//                             product.onSale = 'y';
//                             product.brandID = row.brandID;
//                             product.brandLogo = row.brand_logo;
//                             product.wish = 'y';
//                             product.price = row.price;
//
//                             tagOBJ = {};
//                             tagOBJ.tag_value = row.tag_value;
//
//                             product.tagList.push(tagOBJ);
//
//                             responseOBJ.boutiqueList.push(product);
//
//                         } else {
//                             product = {};
//                             product.pdtID = row.product_id;
//                             product.pdtName = row.product_name;
//                             product.payMethod = row.payMethod;
//                             product.pdtGender = row.productGender;
//                             product.pdtCategory = row.product_category;
//                             product.pdtImageURL = row.product_image;
//                             product.onSale = 'y';
//                             product.brandID = row.brandID;
//                             product.brandLogo = row.brand_logo;
//                             product.wish = 'y';
//                             product.price = row.price;
//                             product.tagList = [];
//
//                             tagOBJ = {};
//                             tagOBJ.tag_value = row.tag_value;
//
//                             product.tagList.push(tagOBJ);
//
//                             responseOBJ.boutiqueList.push(product);
//                         }
//
//
//                     }
//                     PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
//                 }
//                 else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '검색 결과가 없습니다.', {});
//             });
//
//
//         } catch (catchErr) {
//             PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//             PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//         }
//     });



};