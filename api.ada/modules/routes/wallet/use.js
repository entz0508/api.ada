///**
// * Created by kkuris on 2018-07-20.
// */
//
//// common
//const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
//const PACKET = require("../../common/util/packet_sender.js");
//const COMMON_UTIL = require("../../common/util/common.js");
//const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");
//
//// log
//const PRINT_LOG = global.PRINT_LOGGER;
//
//// mysql
//const MYSQL_FIT_ADA_CONN = global.MYSQL_CONNECTOR_POOLS.ADA;
//// testtestteststest
//exports.add_routes = function(app) {
//    app.post("/ada/wallet/usingMoney", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            var requestParams = {};
//            var responseOBJ = {};
//
//            var failResultMsg = "error!";
//
//            requestParams.req = req;
//            requestParams.res = res;
//            requestParams.API_PATH = API_PATH;
//            requestParams.CLIENT_IP = CLIENT_IP;
//
//            PACKET.sendSuccess(req, res, 'search success', {});
//
//            // responseOBJ.testParam = COMMON_UTIL.trim(req.body.test_param);
//
//            // 계정 내 소유하고 있는 재화를 체크
//            // if 소유하고 있는 재화가 아이템 가격보다 낮아야 사용. 
//            // else 아니라면 소지 재화가 부족함을 알려야 함.
//            
//            // MYSQL_FIT_ADA_CONN.procReadingBookList(requestParams, function(err, results) {
//            //     if (err) {
//            //         PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMakeClub", err);
//            //         return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//            //     }
//            //     if((0 < results[0].length)){
//            //         for(var i = 0, len = results[0].length; i < len; i ++){
//            //             var row = results[0][i];
//            //             var responseOBJ = {};
//            //
//            //             responseOBJ.clubid = row.club_id;
//            //             responseOBJ.clubname = row.club_name;
//            //             responseOBJ.bookid = row.book_id;
//            //             responseOBJ.bookname = row.book_name;
//            //             responseOBJ.writer = row.writer;
//            //             responseOBJ.coverurl = row.cover_image;
//            //             responseOBJ.rent_date = row.rent_datetime;
//            //
//            //             // responseOBJ.push(audioBookList);
//            //
//            //         }
//            //         PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
//            //
//            //     } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '�˻� �����?�����ϴ�.', {});
//            //
//            // });
//
//            // if (Number(responseOBJ.testParam)) {
//            //     PACKET.sendSuccess(req, res, 'test msg', responseOBJ ); //sendSuccess: function (req, res, msg, obj)
//            // } else {
//            //     PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, { result: failResultMsg}); //sendFail: function (req, res, error_code, msg, obj) -- -2
//            // }
//
//
//
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
//        }
//    });
//
//    
//};