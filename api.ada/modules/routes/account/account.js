require('date-utils'); // Date.prototype ����
var fs = require("fs"),
        uninitialized = undefined;

// common
const ROUTE_MIDDLEWARE = require("../../common/util/route_middleware.js");
const PACKET = require("../../common/util/packet_sender.js");
const COMMON_UTIL = require("../../common/util/common.js");
const ERROR_CODE_UTIL = require("../../common/util/error_code_util.js");
// const NODE_MAILER = require('../../common/mail/node_mailer.js');

// log
const PRINT_LOG = global.PRINT_LOGGER;

// mysql
const MYSQL_FIT_ADA_ACCOUNT_CONN = global.MYSQL_CONNECTOR_POOLS.ADA_Account;


// nodejs npm
const crypto = require('crypto');

exports.add_routes = function (app) {
    "use strict";

    // var sendMailWelcome = function (toEmailAddr, sendType, sendValue) {
    //     var mail = new NODE_MAILER();
    //     mail.init();

    //     var subject = "[드라마 바이블] " + sendValue.account_name + "님 비밀번호 변경 안내입니다.";

    //     // JSON.stringify(req.body)  @@name / @@time / @@token
    //     // apidev.doralab.co.kr",   host
    //     var html = null;
    //     var strHost = new String(sendValue.host);
    //     var strHost2 = new String("apidev.doralab.co.kr");

    //     if (strHost.toUpperCase() == strHost2.toUpperCase()) {
    //         html = fs.readFileSync('./public/mailForm/forgot_pass_test.html', 'utf8');
    //     } else {
    //         html = fs.readFileSync('./public/mailForm/forgot_pass.html', 'utf8');
    //     }

    //     html = html.replace("@@name", sendValue.account_name);      //  + "[" + strHost + "]"
    //     html = html.replace("@@time", sendValue.live_time);
    //     html = html.replace("@@token", sendValue.email_token);

    //     mail.send(toEmailAddr, subject, html, "", function (error, success) {
    //         if (error) PRINT_LOG.setErrorLog("[" + __filename + "] send Mail sendMailWelcome, Failed ", error);
    //     });
    // };

//    function checkParams(API_PATH, clientUID, signUpPath) {
//        var errParam;
//        if (!COMMON_UTIL.isValidClientUID(clientUID)) errParam = "clientUID";
//        // if (!COMMON_UTIL.isEmail(accountEmail)) errParam = "accountEmail";
//        // if (!COMMON_UTIL.isValidPassword(pwd)) errParam = "pwd";
//        if (!COMMON_UTIL.isValidSignupPath(signUpPath)) errParam = "signUpPath";
//        if (errParam) PRINT_LOG.error(__filename, API_PATH, " error parameter " + errParam);
//        return !errParam;
//    }

    function checkParams(API_PATH, signUpPath, accessToken, os) {
        var errParam;
        if (!COMMON_UTIL.isValidSignupPath(signUpPath)) errParam = "signUpPath";
        if (!COMMON_UTIL.isValidAccessToken(accessToken)) errParam = "accessToken";
        if (!COMMON_UTIL.isValidOS(os)) errParam = 'os';
        
        if (errParam) PRINT_LOG.error(__filename, API_PATH, " error parameter " + errParam);
        return !errParam;
    };
    
    app.post("/ada/account/join", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);

        try {
            var requestParams = {
                clientUID: COMMON_UTIL.trim(req.body.client_uid),
                country: COMMON_UTIL.trim(req.body.country),
                signUpPath: COMMON_UTIL.trim(req.body.signup_path),
                signUpID: COMMON_UTIL.trim(req.body.signup_id),
                nickName: COMMON_UTIL.trim(req.body.nick_name),
                age: COMMON_UTIL.trim(req.body.age),
                gender: COMMON_UTIL.trim(req.body.gender),
                head: COMMON_UTIL.trim(req.body.head),
                armL: COMMON_UTIL.trim(req.body.arm_l),
                armB: COMMON_UTIL.trim(req.body.arm_b),
                legL: COMMON_UTIL.trim(req.body.leg_l),
                legB: COMMON_UTIL.trim(req.body.leg_b),
                skin: COMMON_UTIL.trim(req.body.skin),
                hair: COMMON_UTIL.trim(req.body.hair),
                top: COMMON_UTIL.trim(req.body.top),
                bottom: COMMON_UTIL.trim(req.body.bottom),
                shoes: COMMON_UTIL.trim(req.body.shoes)
            };


            MYSQL_FIT_ADA_ACCOUNT_CONN.procAccountJoin(requestParams, function (err, results) {

                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procAccountJoin", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;
                for (var i = 0; i < len; i++) {
                    var row = results[0][i];
                    var userInfo = {
                        accessToken: row.ACCESS_TOKEN
                    };

                }

                PRINT_LOG.info(API_PATH, __filename, JSON.stringify(req.body));

                if (row.RES == 0) {
                    PACKET.sendSuccess(req, res, row.MSG, {userInfo: userInfo});
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
                }

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });

    app.post("/ada/account/login", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);

        try {

            var signupPath = COMMON_UTIL.trim(req.body.signup_path);
            var signupID = COMMON_UTIL.trim(req.body.signup_id);

            MYSQL_FIT_ADA_ACCOUNT_CONN.procAccountLogin(signupPath, signupID, function (err, results) {

                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procAccountLogin", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;
                for (var i = 0; i < len; i++) {
                    var row = results[0][i];

                    var userInfo = {
                        accessToken: row.ACCESS_TOKEN,
                        nickName: row.NICKNAME,
                        birthDay: row.BIRTHDAY,
                        gender: row.GENDER,
                        country: row.COUNTRY,
                        profileImage: row.PROFILE_IMAGE,
                        age: row.AGE,
                        head: row.B_HEAD,
                        armL: row.B_ARML,
                        armB: row.B_ARMB,
                        legL: row.B_LEGL,
                        legB: row.B_LEGB,
                        skin: row.B_SKIN,
                        hair: row.B_HAIR,
                        top: row.C_TOP,
                        bottom: row.C_BOTTOM,
                        shoes: row.C_SHOES
                    };

                }

                if (row.RES == 0) {
                    PACKET.sendSuccess(req, res, row.MSG, {userInfo: userInfo});
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
                }

            }); 

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });

    app.post("/ada/account/getInfo", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
        var API_PATH = req.route.path;
        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
        var responseOBJ = {};
        responseOBJ.userInfo = {};
        responseOBJ.userStat = {};
        try {

            var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

            MYSQL_FIT_ADA_ACCOUNT_CONN.procAccountInfo(accountID, function (err, results) {

                if (err) {
                    PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procAccountLogin", err);
                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
                }

                var len = results[0].length;
                for (var i = 0; i < len; i++) {
                    var row = results[0][i];
                    
                    
                        responseOBJ.userStat.level = row.Levels;
                        responseOBJ.userStat.exp = row.Exp;
                        responseOBJ.userStat.gold = row.Gold;
                        responseOBJ.userStat.diamond = row.Diamond;
                        responseOBJ.userStat.ticket = row.ticket;
                        responseOBJ.userStat.ticketMax = row.ticketMax;
                        responseOBJ.userStat.cartCount = row.Cart;
                    
                        responseOBJ.userInfo.nickName = row.NICKNAME;
                        responseOBJ.userInfo.birthday = row.BIRTHDAY;
                        responseOBJ.userInfo.gender = row.GENDER;
                        responseOBJ.userInfo.country = row.COUNTRY;
                        responseOBJ.userInfo.profileImage = row.PROFILE_IMAGE;
                        responseOBJ.userInfo.age = row.AGE;
                        responseOBJ.userInfo.head = row.B_HEAD;
                        responseOBJ.userInfo.armL = row.B_ARML;
                        responseOBJ.userInfo.armB = row.B_ARMB;
                        responseOBJ.userInfo.legL = row.B_LEGL;
                        responseOBJ.userInfo.legB = row.B_LEGB;
                        responseOBJ.userInfo.skin = row.B_SKIN;
                        responseOBJ.userInfo.hair = row.B_HAIR;
                        responseOBJ.userInfo.top = row.C_TOP;
                        responseOBJ.userInfo.bottom = row.C_BOTTOM;
                        responseOBJ.userInfo.shoes = row.C_SHOES;
                        
                 
                }

                if (row.RES == 0) {
                    PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
                } else {
                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {});
                }

            });

        } catch (catchErr) {
            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
        }
    });
    
};