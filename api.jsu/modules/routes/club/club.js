/**
 * Created by kkuris on 2018-04-17.
 */

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_JSU_CLUB = global.MYSQL_CONNECTOR_POOLS.JSU_CLUB;
const MYSQL_JSU_BOOK = global.MYSQL_CONNECTOR_POOLS.JSU_BOOK;

exports.add_routes = function(app) {
    app.post("/jsu/club/make", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 만들기 JustShowUp_1.0_화면설계서_20180430_export.pdf 23Page
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};

            requestParams.cName = COMMON_UTIL.trim(req.body.cName);
            requestParams.cRegion = COMMON_UTIL.trim(req.body.cRegion);
            requestParams.cCity = COMMON_UTIL.trim(req.body.cCity);
            requestParams.cDec = COMMON_UTIL.trim(req.body.cDec);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU_CLUB.procMakeClub(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMakeClub", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                var row = results[0][0];

                row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/club/main", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 만들기 JustShowUp_1.0_화면설계서_20180430_export.pdf 23Page
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};

            requestParams.cName = COMMON_UTIL.trim(req.body.cName);
            requestParams.cRegion = COMMON_UTIL.trim(req.body.cRegion);
            requestParams.cCity = COMMON_UTIL.trim(req.body.cCity);
            requestParams.cDec = COMMON_UTIL.trim(req.body.cDec);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU_CLUB.procMakeClub(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMakeClub", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                var row = results[0][0];

                row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/club/readingBookMain", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 만들기 JustShowUp_1.0_화면설계서_20180430_export.pdf 23Page
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            // var responseOBJ = {};

            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU_BOOK.procReadingBookMain(requestParams, function(err, results) {
                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len; i ++){
                        var row = results[0][i];
                        var responseOBJ = {};

                        responseOBJ.readCnt = row.cnt;
                        responseOBJ.bookid = row.book_id;
                        responseOBJ.coverurl = row.cover_image;

                        // responseOBJ.push(audioBookList);

                    }
                    PACKET.sendSuccess(req, res, row.MSG, responseOBJ);

                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '대여중인 오디오 북이 없습니다.', {});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/club/readingBookList", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 만들기 JustShowUp_1.0_화면설계서_20180430_export.pdf 23Page
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            // var responseOBJ = {};

            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU_BOOK.procReadingBookList(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMakeClub", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len; i ++){
                        var row = results[0][i];
                        var responseOBJ = {};

                        responseOBJ.clubid = row.club_id;
                        responseOBJ.clubname = row.club_name;
                        responseOBJ.bookid = row.book_id;
                        responseOBJ.bookname = row.book_name;
                        responseOBJ.writer = row.writer;
                        responseOBJ.coverurl = row.cover_image;
                        responseOBJ.rent_date = row.rent_datetime;

                        // responseOBJ.push(audioBookList);

                    }
                    PACKET.sendSuccess(req, res, row.MSG, responseOBJ);

                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '대여중인 오디오 북이 없습니다.', {});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    // app.post("/jsu/club/completeBookMain", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //
    //         var requestParams = {};
    //         // var responseOBJ = {};
    //
    //         requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
    //
    //         MYSQL_JSU_BOOK.procReadingBookMain(requestParams, function(err, results) {
    //             if((0 < results[0].length)){
    //                 for(var i = 0, len = results[0].length; i < len; i ++){
    //                     var row = results[0][i];
    //                     var responseOBJ = {};
    //
    //                     responseOBJ.readCnt = row.cnt;
    //                     responseOBJ.bookid = row.book_id;
    //                     responseOBJ.coverurl = row.cover_image;
    //
    //                     // responseOBJ.push(audioBookList);
    //
    //                 }
    //                 PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
    //
    //             } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '대여중인 오디오 북이 없습니다.', {});
    //
    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
    //     }
    // });
    //
    // app.post("/jsu/club/completeBookList", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //
    //         var requestParams = {};
    //         // var responseOBJ = {};
    //
    //         requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
    //
    //         MYSQL_JSU_BOOK.procReadingBookList(requestParams, function(err, results) {
    //             if (err) {
    //                 PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMakeClub", err);
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //             if((0 < results[0].length)){
    //                 for(var i = 0, len = results[0].length; i < len; i ++){
    //                     var row = results[0][i];
    //                     var responseOBJ = {};
    //
    //                     responseOBJ.clubid = row.club_id;
    //                     responseOBJ.clubname = row.club_name;
    //                     responseOBJ.bookid = row.book_id;
    //                     responseOBJ.bookname = row.book_name;
    //                     responseOBJ.writer = row.writer;
    //                     responseOBJ.coverurl = row.cover_image;
    //                     responseOBJ.rent_date = row.rent_datetime;
    //
    //                     // responseOBJ.push(audioBookList);
    //
    //                 }
    //                 PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
    //
    //             } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '대여중인 오디오 북이 없습니다.', {});
    //
    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
    //     }
    // });


};