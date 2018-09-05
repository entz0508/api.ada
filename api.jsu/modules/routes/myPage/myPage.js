/**
 * Created by kkuris on 2018-05-03.
 */
// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_JSU = global.MYSQL_CONNECTOR_POOLS.JSU_BOOK;

exports.add_routes = function(app) {
    app.post("/jsu/mypage/main", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);

        try {
            var requestParams = {};
            var infoList = [];
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU.procMypageMain(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMypageMain", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                // var row = results[0][i];

                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len; i ++){
                        var row = results[0][i];
                        var responseOBJ = {};

                        // bookList.club_name = row.club_name;
                        // bookList.club_country = row.country;
                        // bookList.club_city = row.city;
                        // bookList.club_memberCnt = row.membership;
                        responseOBJ.name = row.tmpUserName;
                        responseOBJ.imageURL = row.tmpProfileURL;
                        responseOBJ.bookmark = row.bookmarkCnt;
                        responseOBJ.audiobook = row.rentAudioBookCnt;
                        responseOBJ.schedule = row.scheduleCnt;
                        responseOBJ.club = row.clubRequestCnt;

                        // infoList.push(responseOBJ);


                    }
                    PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
                    // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {clubList: clubList});
                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '조회 실패', {});

                // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });



    app.post("/jsu/mypage/bookmark", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);

        try {
            var requestParams = {};
            var infoList = [];
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU.procMypageBookmark(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMypageBookmark", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                // var row = results[0][i];

                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len; i ++){
                        var row = results[0][i];
                        var bookList = {};

                        // bookList.club_name = row.club_name;
                        // bookList.club_country = row.country;
                        // bookList.club_city = row.city;
                        // bookList.club_memberCnt = row.membership;
                        bookList.bookid = row.book_id;
                        bookList.bookname = row.book_name;
                        bookList.writer = row.writer;
                        bookList.bookmark = row.bookmark;

                        infoList.push(bookList);


                    }
                    PACKET.sendSuccess(req, res, row.MSG, {infoList: infoList})
                    // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {clubList: clubList});
                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '북마크 한 책이 없습니다.', {});

                // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });

    app.post("/jsu/mypage/audioBookList", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);

        try {
            var requestParams = {};
            var infoList = [];
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU.procMypageAudioBookList(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procMypageBookmark", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }
                // var row = results[0][i];

                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len; i ++){
                        var row = results[0][i];
                        var audioBookList = {};

                        audioBookList.clubid = row.club_id;
                        audioBookList.clubname = row.club_name;
                        audioBookList.bookid = row.book_id;
                        audioBookList.bookname = row.book_name;
                        audioBookList.writer = row.writer;
                        audioBookList.coverurl = row.cover_image;
                        audioBookList.rent_date = row.rent_datetime;
                        audioBookList.expire_date = row.expire_datetime;

                        infoList.push(audioBookList);

                    }
                    PACKET.sendSuccess(req, res, row.MSG, {infoList: infoList})
                    // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {clubList: clubList});
                } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '대여중인 오디오 북이 없습니다.', {});

                // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });

};