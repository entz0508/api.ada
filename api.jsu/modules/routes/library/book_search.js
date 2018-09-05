/**
 * Created by kkuris on 2018-01-02.
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
    app.post("/jsu/library/search", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            var book_list = [];

            requestParams.list_type  = COMMON_UTIL.trim(req.body.list_type);
            // requestParams.accountID = COMMON_UTIL.trim(req.body.uuid);
            requestParams.cur_page = COMMON_UTIL.trim(req.body.cur_page);
            requestParams.count_per_page = COMMON_UTIL.trim(req.body.count_per_page);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU.procBookSearch(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procBookSearch", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len ; i ++){
                        var row = results[0][i];
                        var curBookList = {};

                        curBookList.bookid = row.bookid;
                        curBookList.title = row.title;
                        curBookList.writer = row.writer;
                        curBookList.publisher = row.publisher;
                        curBookList.coverurl = row.coverurl;
                        curBookList.bookmark = row.bookmark;

                        book_list.push(curBookList);

                        // if(curBookList.bookid !== row.bookid){
                        // // curBookList = {};
                        //
                        // curBookList.bookid = row.bookid;
                        // curBookList.title = row.title;
                        // curBookList.writer = row.writer;
                        // curBookList.publisher = row.publisher;
                        // curBookList.coverurl = row.coverurl;
                        // curBookList.bookmark = row.bookmark;
                        //
                        // book_list.push(curBookList);
                        //
                        // }
                    }

                }

                row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {book_list: book_list}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {book_list:book_list});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/library/searchDetail", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            var book_list = [];


            requestParams.book_id = COMMON_UTIL.trim(req.body.book_id);
            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

            MYSQL_JSU.procBookSearchDetail(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procBookSearchDetail", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if((0 < results[0].length)){
                    var lastBookList = {};
                    var result = results[0][0];


                    lastBookList.bookid = result.bookid;
                    lastBookList.category = result.category;
                    lastBookList.title = result.book_title;
                    lastBookList.writer = result.writer;
                    lastBookList.publisher = result.publisher;
                    lastBookList.bookmark = result.bookmark;
                    lastBookList.outlink = result.buylink;
                    lastBookList.description_introduce = result.description_introduce;
                    lastBookList.description_table = result.description_table;
                    lastBookList.description_writer = result.description_writer;
                    lastBookList.coverurl = result.coverurl;
                    lastBookList.audiourl = result.audiourl;
                    lastBookList.tablelist = [];
                    lastBookList.clubcount = result.tmpRentCount;
                    lastBookList.clublist = [];

                    var tableList = {};
                    var clubList = {};
                    var len = results[0].length;
                    var unitCount;
                    unitCount = result.tmpUnitCount;

                    if(lastBookList.clubcount == 0){
                        for(var j = 0; j < unitCount ; j++) {
                            var row1 = results[0][j];

                            if(tableList.title !== row1.unittitle) {
                                tableList = {};
                                tableList.id = row1.unit_id;
                                tableList.title = row1.unittitle;
                                tableList.time = row1.playtime;

                                // PRINT_LOG.info(API_PATH,"rent count is 0 ",JSON.stringify(tableList));

                                lastBookList.tablelist.push(tableList);
                            }

                        }

                    } else {

                        for(var j = 0; j < unitCount ; j++) {
                            var row1 = results[0][j];

                            if(tableList.title !== row1.unittitle) {
                                tableList = {};
                                tableList.id = row1.unit_id;
                                tableList.title = row1.unittitle;
                                tableList.time = row1.playtime;

                                // PRINT_LOG.info(API_PATH,"rent count is exist",JSON.stringify(tableList));

                                lastBookList.tablelist.push(tableList);
                            }

                        }
                    }


                    for(var i = 0; i < len; i++) {
                        var row = results[0][i];

                        if(clubList.clubname !== row.club_name) {

                            clubList = {};
                            clubList.clubid = row.club_id;
                            clubList.clubname = row.club_name;

                            lastBookList.clublist.push(clubList);

                        }
                    }

                    book_list.push(lastBookList);
                    PACKET.sendSuccess(req, res, row.MSG,{book_list: book_list});
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '처리 실패', {});
                }


            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });

    app.post("/jsu/library/searchKeyword", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            var book_list = [];

            requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
            requestParams.keyWord = COMMON_UTIL.trim(req.body.keyword);

            MYSQL_JSU.procBookSearchKeyword(requestParams, function(err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procBookSearchKeyword", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if((0 < results[0].length)){
                    for(var i = 0, len = results[0].length; i < len ; i ++){
                        var row = results[0][i];
                        var curBookList = {};

                        curBookList.bookid = row.book_id;
                        curBookList.title = row.book_name;
                        curBookList.writer = row.writer;
                        curBookList.coverurl = row.cover_image;
                        // curBookList.bookmark = row.bookmark;

                        book_list.push(curBookList);
                    }

                }

                row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {book_list: book_list}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {book_list:book_list});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });


};