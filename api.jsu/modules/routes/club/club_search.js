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
const MYSQL_JSU_CLUB = global.MYSQL_CONNECTOR_POOLS.JSU_CLUB;
    exports.add_routes = function(app) {

        app.post("/jsu/club/searchName", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 찾기 JustShowUp_1.0_화면설계서_20180430_export.pdf 22Page
            var API_PATH = req.route.path;
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);
            try {

                var requestParams = {};
                var clubList = [];

                requestParams.c_name = COMMON_UTIL.trim(req.body.c_name);
                // requestParams.cRegion = COMMON_UTIL.trim(req.body.cRegion);
                requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

                MYSQL_JSU_CLUB.procSearchClubName(requestParams, function(err, results) {
                    if (err) {
                        PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procSearchClubName", err);
                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                    }

                    if((0 < results[0].length)){
                        for(var i = 0, len = results[0].length; i < len; i ++){
                            var row = results[0][i];
                            var curClubList = {};

                            curClubList.club_name = row.club_name;
                            curClubList.club_country = row.country;
                            curClubList.club_city = row.city;
                            curClubList.club_memberCnt = row.membership;

                            clubList.push(curClubList);


                        }
                        PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList})
                        // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {clubList: clubList});
                    } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '조회 실패', {});


                });
            } catch (catchErr) {
                PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
            }
        });

        app.post("/jsu/club/searchAll", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function(req, res) { //클럽 찾기 JustShowUp_1.0_화면설계서_20180430_export.pdf 22Page
            var API_PATH = req.route.path;
            var CLIENT_IP = COMMON_UTIL.getClientIP(req);
            try {

                var requestParams = {};
                var clubList = [];

                requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);

                MYSQL_JSU_CLUB.procSearchClubAll(requestParams, function(err, results) {
                    if (err) {
                        PRINT_LOG.setErrorLog("Failed, MYSQL_JSU.procSearchClubAll", err);
                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                    }

                    if((0 < results[0].length)){
                        for(var i = 0, len = results[0].length; i < len; i ++){
                            var row = results[0][i];
                            var curClubList = {};

                            curClubList.club_name = row.club_name;
                            curClubList.club_country = row.country;
                            curClubList.club_city = row.city;
                            curClubList.club_memberCnt = row.membership;

                            clubList.push(curClubList);
                        }

                        PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList})
                        // PACKET.sendSuccess(req, res, {searchList: searchList});
                        // row.RES == 0 ? PACKET.sendSuccess(req, res, row.MSG, {clubList: clubList}) : PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '조회 실패', {clubList: clubList});
                    } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, '조회 실패', {});

                });
            } catch (catchErr) {
                PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
                PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN);
            }
        });
    };