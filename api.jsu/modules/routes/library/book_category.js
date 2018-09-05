/**
 * Created by kkuris on 2018-04-16.
 */
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_JSU = global.MYSQL_CONNECTOR_POOLS.JSU;

exports.add_routes = function(app) {
    app.post("/jsu/library/category_search", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { //도서 카테고리 선택 시 도서 리스트 출력
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        try {

            var requestParams = {};
            var searchList = [];

            // requestParams.title = COMMON_UTIL.trim(req.body.title);
            // requestParams.writer = COMMON_UTIL.trim(req.body.writer);
            requestParams.category = COMMON_UTIL.trim(req.body.category);

            MYSQL_JSU.procCategoryBookSearch(requestParams, function (err, results) {
                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procBookSearch", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                if ((0 < results[0].length)) {
                    for (var i = 0, len = results[0].length; i < len; i++) {
                        var row = results[0][i];
                        var curBookList = {};

                        curBookList.title = row.title;
                        curBookList.writer = row.writer;
                        curBookList.date = row.date;
                        curBookList.category = row.category;
                        curBookList.page = row.page;

                        searchList.push(curBookList);

                        if (curBookList.writer == row.writer) {
                            curBookList = {};
                            curBookList.title = row.title;
                            curBookList.writer = row.writer;
                            curBookList.category = row.category;
                            curBookList.date = row.date;
                            curBookList.page = row.page;
                        }
                    }

                }
                PACKET.sendSuccess3(req, res, {searchList: searchList});

            });
        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
        }
    });
};
