/**
 * Created by kkuris on 2018-05-16.
 */
/**
 * Created by kkuris on 2018-05-16.
 */
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

exports.add_routes = function(app) {
    // app.post("/ada/product/detail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         var requestParams = {};
    //         var responseOBJ = {};
    //
    //         var productDetail = {
    //             pdtID: "",
    //             pdtName: "",
    //             productCategory: "",
    //             payMethod: "",
    //             price: "",
    //             brandID: "",
    //             brandLogo: "",
    //             brandName: "",
    //             brandDescription: "",
    //             baseColor: "",
    //             pointColor: "",
    //             pdtImgUrl: "",
    //             buyLink: "",
    //             releaseDate: "",
    //             onSale: "",
    //             wish: "",
    //             getPoint: "",
    //             pdtInfo: "",
    //             pdtInfoDetail : "",
    //             pdtGender : "",
    //             discountRatio: "",
    //             likeCount: "",
    //             tagList: [],
    //             likeList: []
    //         };
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
    //         MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail(requestParams, function(err, results) {
    //             if (err) {
    //                 PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //
    //             var len = results[0].length;
    //
    //             for(var i = 0; i < len; i++){
    //                 var row = results[0][i];
    //
    //
    //                 var productLikeOBJ = {
    //                     profileID : 2,
    //                     profileName : "chris",
    //                     profileImage : "www.google"
    //                 };
    //
    //                 var tagOBJ = {
    //                     tag_value: row.tag_value
    //                 };
    //
    //                 responseOBJ.accountID = 100000003;
    //                 responseOBJ.gender = 2;
    //                 responseOBJ.gold = 10000;
    //                 responseOBJ.jem = 2000;
    //                 responseOBJ.productDetail = [];
    //
    //                 productDetail = {
    //                     pdtID: row.item_id,
    //                     pdtName: row.item_fullname,
    //                     productCategory: row.category_name,
    //                     payMethod: row.price_type,
    //                     price: row.price,
    //                     brandID: row.brand_id,
    //                     brandLogo: row.thum_image,
    //                     brandName: row.brand_name,
    //                     brandDescription: row.description,
    //                     baseColor: row.basecolor,
    //                     pointColor: row.pointcolor,
    //                     pdtImgUrl: row.attach_path,
    //                     buyLink: row.ONLINE_LINK,
    //                     releaseDate: row.release_date,
    //                     onSale: "y",
    //                     wish: "y",
    //                     getPoint: row.exp_point,
    //                     pdtInfo: row.INTRODUCTION,
    //                     pdtInfoDetail : row.MOREINFOMATION,
    //                     pdtGender : row.gender,
    //                     discountRatio: row.dis_ratio,
    //                     likeCount: 0,
    //                     tagList: [],
    //                     likeList: []
    //                 };
    //
    //                 productDetail.tagList.push(tagOBJ);
    //                 productDetail.likeList.push(productLikeOBJ);
    //
    //                 responseOBJ.productDetail.push(productDetail);
    //
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

    app.post("/ada/boutique/productDetail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) { //middleware LOGGED_IN_ACCOUNT 로
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {
            var requestParams = {};
            var responseOBJ = {};

            var failResultMsg = "error!";

            requestParams.req = req;
            requestParams.res = res;
            requestParams.API_PATH = API_PATH;
            requestParams.CLIENT_IP = CLIENT_IP;
            // requestParams.tagKeyword = COMMON_UTIL.trim(req.body.tag_keyword);
            requestParams.pdtID = COMMON_UTIL.trim(req.body.pdt_id);

            MYSQL_FIT_ADA_CONN.procBoutiqueProductDetail(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_CONN.procBoutiqueMain", err);
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
                productDetail.likeList = [];

                var productLikeOBJ = {};
                productLikeOBJ.profileID = "";
                productLikeOBJ.profileName = "chris";
                productLikeOBJ.profileImage = "www.google";


                var len = results[0].length;

                for(var i = 0; i < len; i++){
                    var row = results[0][i];

                    var tagOBJ = {};
                    tagOBJ.tag_value = row.tag_value;

                    responseOBJ.accountID = 100000003;
                    responseOBJ.gender = 2;
                    responseOBJ.gold = 10000;
                    responseOBJ.jem = 2000;
                    responseOBJ.productDetail = [];

                    if(tagOBJ.tag_value === row.tag_value){
                        PRINT_LOG.info("","is first loop",i)
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
                        productDetail.pdtImgUrl = row.attach_path;
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
                        tagOBJ.tag_value = row.tag_value;
                        productDetail.tagList.push(tagOBJ);

                        productLikeOBJ = {};
                        productLikeOBJ.profileID = "";
                        productLikeOBJ.profileName = "chris";
                        productLikeOBJ.profileImage = "www.google";
                        productDetail.likeList.push(productLikeOBJ);

                        responseOBJ.productDetail.push(productDetail);
                    }
//                    } else {
//
//                        productDetail = {};
//                        productDetail.pdtID = row.item_id;
//                        productDetail.pdtName = row.item_fullname;
//                        productDetail.productCategory = row.category_name;
//                        productDetail.payMethod = row.price_type;
//                        productDetail.price = row.price;
//                        productDetail.brandID = row.brand_id;
//                        productDetail.brandLogo = row.thum_image;
//                        productDetail.brandName = row.brand_name;
//                        productDetail.brandDescription = row.description;
//                        productDetail.baseColor = row.basecolor;
//                        productDetail.pointColor = row.pointcolor;
//                        productDetail.pdtImgUrl = row.attach_path;
//                        productDetail.buyLink = row.ONLINE_LINK;
//                        productDetail.releaseDate = row.release_date;
//                        productDetail.onSale = 'y';
//                        productDetail.wish = 'y';
//                        productDetail.getPoint = row.exp_point;
//                        productDetail.pdtInfo = row.introduction;
//                        productDetail.pdtInfoDetail = row.MOREINFOMATION;
//                        productDetail.pdtGender = row.gender;
//                        productDetail.discountRatio = row.dis_ratio;
//                        productDetail.likeCount = 0;
//                        productDetail.tagList = [];
//                        productDetail.likeList = [];
//
//                        tagOBJ = {};
//                        tagOBJ.tag_value = row.tag_value;
//                        productDetail.tagList.push(tagOBJ);
//
//                        productLikeOBJ = {};
//                        productLikeOBJ.profileID = "";
//                        productLikeOBJ.profileName = "chris";
//                        productLikeOBJ.profileImage = "www.google";
//                        productDetail.likeList.push(productLikeOBJ);
//
//                        responseOBJ.productDetail.push(productDetail);
//
//                    }

                }

                !Number(requestParams.pdtID) ? PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, failResultMsg, {}) : PACKET.sendSuccess(req, res, 'search success', responseOBJ);
            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};