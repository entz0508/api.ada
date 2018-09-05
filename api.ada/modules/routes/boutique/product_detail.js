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

exports.add_routes = function(app) {
    app.post("/ada/boutique/productDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            var failResultMsg = "error!";
            var tmpColor;
            var tmpAttach;

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            // requestParams.tagKeyword = COMMON_UTIL.trim(req.body.tag_keyword);
            requestParams.pdtID = COMMON_UTIL.trim(req.body.pdt_id);

            MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var productDetail = {};
                productDetail.pdtID = "";
                productDetail.pdtName = "";
                productDetail.productCategory = "";
                productDetail.payMethod = "";
                productDetail.price = "";
                productDetail.brandID = "";
                productDetail.brandLogo = "";
                productDetail.brandName = "";
                productDetail.brandDescription = "";
                productDetail.baseColor = "";
                productDetail.pointColor = "";
                productDetail.pdtImgUrl = "";
                productDetail.buyLink = "";
                productDetail.releaseDate = "";
                productDetail.onSale = "";
                productDetail.wish = "";
                productDetail.getPoint = "";
                productDetail.pdtInfo = "";
                productDetail.pdtInfoDetail = "";
                productDetail.pdtGender = "";
                productDetail.discountRatio = "";
                productDetail.likeCount = "";
                productDetail.tagList = [];
                productDetail.colorList = [];
                productDetail.attachList = [];
                var tagOBJ = {};
                var colorOBJ = {};
                var attachOBJ = {};
                var a = 1;

                var len = results[0].length;

                for(var i = 0; i < len; i++) {
                    var row = results[0][i];
                    if(productDetail.pdtID === row.item_id){
                        if(tagOBJ.tagValue === row.tag_value){
                            if(colorOBJ.colorID === row.color_id){
                                if(attachOBJ.attachType === row.attach_type){

                                    attachOBJ = {};
                                    attachOBJ.attachType = row.attach_type;
                                    attachOBJ.attachPath = row.attach_path;
                                    attachOBJ.attachInfo = row.attach_info;
                                    // productDetail.attachList.push(attachOBJ);

                                    while(a < tmpAttach){
                                        a++;
                                        productDetail.attachList.push(attachOBJ);
        }
                                }

                            } else {
                              colorOBJ = {};
                              colorOBJ.colorID = row.color_id;

                              // attachOBJ = {};
                              // attachOBJ.attachType = row.attach_type;
                              // attachOBJ.attachPath = row.attach_path;
                              // attachOBJ.attachInfo = row.attach_info;

                              while(a < tmpColor){
                                  a++;
                                  productDetail.colorList.push(colorOBJ);
                              }


                            }

                        } else {
                            tagOBJ = {};
                            tagOBJ.tagValue = row.tag_value;
                            productDetail.tagList.push(tagOBJ);
                        }

                    } else {
                        tmpColor = row.tmpColorCount;
                        tmpAttach = row.tmpAttachCount;

                        responseOBJ.accountID = 100000003;
                        responseOBJ.gender = 2;
                        responseOBJ.gold = 10000;
                        responseOBJ.jem = 2000;
                        responseOBJ.productDetail = [];

                        productDetail.pdtID = row.item_id;
                        productDetail.pdtName = row.item_fullname;
                        productDetail.productCategory = row.category_name;
                        productDetail.payMethod = row.price_type;
                        productDetail.price = row.price;
                        productDetail.brandID = row.brand_id;
                        productDetail.brandLogo = row.thum_image;
                        productDetail.brandName = row.brand_name;
                        productDetail.brandDescription = row.description;
                        productDetail.baseColor = row.basecolor;
                        productDetail.pointColor = row.pointcolor;
                        productDetail.buyLink = row.ONLINE_LINK;
                        productDetail.releaseDate = row.release_date;
                        productDetail.onSale = 'y';
                        productDetail.wish = 'y';
                        productDetail.getPoint = row.exp_point;
                        productDetail.pdtInfo = row.introduction;
                        productDetail.pdtInfoDetail = row.MOREINFOMATION;
                        productDetail.pdtGender = row.gender;
                        productDetail.discountRatio = row.dis_ratio;
                        productDetail.likeCount = 0;

                        tagOBJ = {};
                        tagOBJ.tagValue = row.tag_value;
                        productDetail.tagList.push(tagOBJ);

                        colorOBJ = {};
                        colorOBJ.colorID = row.color_id;
                        productDetail.colorList.push(colorOBJ);

                        attachOBJ = {};
                        attachOBJ.attachType = row.attach_type;
                        attachOBJ.attachPath = row.attach_path;
                        attachOBJ.attachInfo = row.attach_info;
                        productDetail.attachList.push(attachOBJ);

                        responseOBJ.productDetail.push(productDetail);
                    }
                }

                !Number(requestParams.pdtID) ? PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, failResultMsg, {}) : PACKET.sendSuccess(req, res, 'search success', responseOBJ);
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


    // app.post("/ada/boutique/productDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         var requestParams = {};
    //         var responseOBJ = {};
    //         responseOBJ.productDetailList = [];
    //
    //         var failResultMsg = "error!";
    //
    //         requestParams.req = req;
    //         requestParams.res = res;
    //         requestParams.API_PATH = API_PATH;
    //         requestParams.CLIENT_IP = CLIENT_IP;
    //         // requestParams.tagKeyword = COMMON_UTIL.trim(req.body.tag_keyword);
    //         requestParams.pdtID = COMMON_UTIL.trim(req.body.pdt_id);
    //
    //         var productDetail = {};
    //         productDetail.pdtID = "";
    //         productDetail.pdtName = "";
    //         productDetail.productCategory = "";
    //         productDetail.payMethod = "";
    //         productDetail.price = "";
    //         productDetail.brandID = "";
    //         productDetail.brandLogo = "";
    //         productDetail.brandName = "";
    //         productDetail.brandDescription = "";
    //         productDetail.baseColor = "";
    //         productDetail.pointColor = "";
    //         productDetail.pdtImgUrl = "";
    //         productDetail.buyLink = "";
    //         productDetail.releaseDate = "";
    //         productDetail.onSale = "";
    //         productDetail.wish = "";
    //         productDetail.getPoint = "";
    //         productDetail.pdtInfo = "";
    //         productDetail.pdtInfoDetail = "";
    //         productDetail.pdtGender = "";
    //         productDetail.discountRatio = "";
    //         productDetail.likeCount = "";
    //         productDetail.tagList = [];
    //         productDetail.attachList = [];
    //         productDetail.colorList = [];
    //         productDetail.likeList = [];
    //
    //         var attachOBJ = {};
    //         var colorOBJ = {};
    //         var tagOBJ = {};
    //         var tmpAttach;
    //         var tmpColor;
    //         var tmpTag;
    //         var tmpCount;
    //
    //
    //         MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail(requestParams, function(err, results) {
    //             if (err) {
    //                 PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //
    //             var len = results[0].length;
    //
    //             var tmpArrary = new Array(tmpAttach);
    //
    //             for(var i = 0; i < len; i++) {
    //                 var row = results[0][i];
    //
    //                 tmpAttach = row.tmpAttachCount;
    //                 tmpColor = row.tmpColorCount;
    //                 tmpTag = row.tmpTagCount;
    //                 tmpCount = tmpColor * tmpTag;
    //
    //                 if(productDetail.pdtID === row.item_id){
    //
    //                     if(tagOBJ.tag_value !== row.tag_value) {
    //
    //                         tagOBJ = {};
    //                         tagOBJ.tag_value = row.tag_value;
    //                         productDetail.tagList.push(tagOBJ);
    //                     }
    //
    //                 } else {
    //
    //                         productDetail.pdtID = row.item_id;
    //                         productDetail.pdtName = row.item_fullname;
    //                         productDetail.productCategory = row.category_name;
    //                         productDetail.payMethod = row.price_type;
    //                         productDetail.price = row.price;
    //                         productDetail.brandID = row.brand_id;
    //                         productDetail.brandLogo = row.thum_image;
    //                         productDetail.brandName = row.brand_name;
    //                         productDetail.brandDescription = row.description;
    //                         productDetail.baseColor = row.basecolor;
    //                         productDetail.pointColor = row.pointcolor;
    //                         productDetail.pdtImgUrl = row.attach_path;
    //                         productDetail.buyLink = row.ONLINE_LINK;
    //                         productDetail.releaseDate = row.release_date;
    //                         productDetail.onSale = 'y';
    //                         productDetail.wish = 'y';
    //                         productDetail.getPoint = row.exp_point;
    //                         productDetail.pdtInfo = row.introduction;
    //                         productDetail.pdtInfoDetail = row.MOREINFOMATION;
    //                         productDetail.pdtGender = row.gender;
    //                         productDetail.discountRatio = row.dis_ratio;
    //                         productDetail.likeCount = 0;
    //                         productDetail.tagList = [];
    //                         productDetail.attachList = [];
    //                         productDetail.colorList = [];
    //                         productDetail.likeList = [];
    //
    //                         tagOBJ.tag_value = row.tag_value;
    //                         productDetail.tagList.push(tagOBJ);
    //
    //                         // attachOBJ = {};
    //                         // attachOBJ.attach_type = row.attach_type;
    //                         // attachOBJ.attach_path = row.attach_path;
    //                         // attachOBJ.attach_info = row.attach_info;
    //                         // productDetail.attachList.push(attachOBJ);
    //                         //
    //                         // colorOBJ.colorID = row.color_id;
    //                         // productDetail.colorList.push(colorOBJ);
    //
    //                         responseOBJ.productDetailList.push(productDetail);
    //                     }
    //
    //             }
    //
    //             for(var j = 0; j < tmpColor; j ++){
    //                 var row1 = results[0][j];
    //                 colorOBJ = {};
    //                 colorOBJ.colorID = row1.color_id;
    //                 // console.log(tmpColor);
    //                 productDetail.colorList.push(colorOBJ);
    //
    //                 // responseOBJ.productDetailList.push(productDetail);
    //             }
    //
    //             for(var j = 0; j < len; j ++){
    //                 var row1 = results[0][j];
    //
    //                 // if(attachOBJ.attach_type !== row1.attach_type){
    //
    //                     attachOBJ = {};
    //                     attachOBJ.attach_type = row1.attach_type;
    //                     attachOBJ.attach_path = row1.attach_path;
    //                     attachOBJ.attach_info = row1.attach_info;
    //
    //
    //                     // productDetail.attachList.push(attachOBJ);
    //
    //                     for(var i in attachOBJ){
    //                         // console.log("property name :"+ i + "value : "+attachOBJ[i]); // i 프로퍼티 속성
    //                         tmpArrary[j] = attachOBJ[i];
    //                         if(tmpArrary[j] !== tmpArrary[j+1]){
    //                             // productDetail.attachList.push(attachOBJ);
    //                             // productDetail.attachList.push(tmpArrary);
    //                         }
    //                     }
    //
    //                     // console.log(Object.keys(attachOBJ.attach_type).length);
    //                 // }
    //
    //                 // responseOBJ.productDetailList.push(productDetail);
    //             }
    //
    //             !Number(requestParams.pdtID) ? PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, failResultMsg, {}) : PACKET.sendSuccess(req, res, 'search success', responseOBJ);
    //         });
    //
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
    //     }
    // });
};