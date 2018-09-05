/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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

    function checkParams(API_PATH, signUpPath) {
        var errParam;
        if (!COMMON_UTIL.isValidSignupPath(signUpPath))
            errParam = "signUpPath";
        if (errParam)
            PRINT_LOG.error(__filename, API_PATH, " error parameter " + errParam);
        return !errParam;
    }
//        app.post("/ada/account/join", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
//            var API_PATH = req.route.path;
//            var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//            
//            try {
//                
//                    var signupPath = COMMON_UTIL.trim(req.body.signup_path);
//                    var signupID = COMMON_UTIL.trim(req.body.signup_id);
//               
//                    MYSQL_FIT_ADA_ACCOUNT_CONN.procTestAccountJoin(signupPath, signupID, function(err, results){
//                     
//                        if (err) {
//                        PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procTestAccountJoin", err);
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                        }
//                        
//                        if (!checkParams(API_PATH, signupPath)) {
//                            PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
//                        };
//                        
//                        var row = results[0][0];
//                        var responseOBJ = {
//                           accountID: row.isSuccess,
//                           signUpID: row.signupID,
//                           accessToken: row.accessToken
//                        };
//
//                        if(row.RES == 0){
//                            PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
//                        } else if(row.RES == -2) {
//                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_CREATE_USER_ACCOUNT, row.MSG, responseOBJ);
//                        } else if(row.RES == -1) {
//                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER, row.MSG, responseOBJ);
//                        } else {
//                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, responseOBJ);
//                        }
//
//                    });
//
//                } catch (catchErr) {
//                    PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
//                }
//        });
//
//    app.post("/ada/account/login", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
//            var API_PATH = req.route.path;
//            var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//            
//            try {
//                
//                    var signupPath = COMMON_UTIL.trim(req.body.signup_path);
//                    var accountID = COMMON_UTIL.trim(req.body.account_id);
//                    
//                    MYSQL_FIT_ADA_ACCOUNT_CONN.procTestAccountLogin(signupPath, accountID, function(err, results){
//                     
//                        if (err) {
//                        PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procTestAccountJoin", err);
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                        }
//                        
//                        if (!checkParams(API_PATH, signupPath)) {
//                            PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
//                        };
//                        
//                        var row = results[0][0];
//                        
//                        var responseOBJ = {};
//                        responseOBJ.accountID = row.accountID;
//                        responseOBJ.accessToken = row.accessToken;
//                        
//                        if(row.RES == 0){
//                            PACKET.sendSuccess(req, res, row.MSG, responseOBJ);
//                        } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, responseOBJ);
//                        
//
//                    });
//
//                } catch (catchErr) {
//                    PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
//                }
//        });
//
//    app.post("/ada/account/leave", ROUTE_MIDDLEWARE.NO_AUTH_APP, function(req, res) {
//            var API_PATH = req.route.path;
//            var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//            
//            try {
//                
//                    var signupPath = COMMON_UTIL.trim(req.body.signup_path);
//                    var accountID = COMMON_UTIL.trim(req.body.account_id);
//                    var isDelete;
//                    
//                    MYSQL_FIT_ADA_ACCOUNT_CONN.procTestAccountLeave(signupPath, accountID, function(err, results){
//                     
//                        if (err) {
//                        PRINT_LOG.setErrorLog("Failed, MYSQL_FIT_ADA_ACCOUNT.procTestAccountLeave", err);
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                        }
//                        
//                        if (!checkParams(API_PATH, signupPath)) {
//                            PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
//                        return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
//                        };
//                        
//                        var row = results[0][0];
//                      
//                        if(row.RES == 0){
//                            
//                            isDelete = 0;
//                            PACKET.sendSuccess(req, res, row.MSG, {isDelete: isDelete});
//                        } else {
//                            isDelete = 1;
//                            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, row.MSG, {isDelete: isDelete});
//                        }
//
//                    });
//
//                } catch (catchErr) {
//                    PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//                    PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, {"errorinfo": catchErr});
//                }
//        });


//    app.post("/ada/account/makeAvatar", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) { 
//    // app.post("/ada/account/makeAvatar", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) { 
//        var API_PATH = req.route.path;
//        var CLIENT_IP = COMMON_UTIL.getClientIP(req);
//        try {
//            
//            var randomGender;
//            randomGender = parseInt(Math.random()*2)+1;
//
//            var isRes;
//            
//            // var requestParams = {};
//            // requestParams.os = COMMON_UTIL.trim(req.body.os);
//            // requestParams.clientUID = COMMON_UTIL.trim(req.body.client_uid);
//            // requestParams.accessToken = COMMON_UTIL.trim(req.body.access_token);
//            // requestParams.accountID = COMMON_UTIL.trim(req.body.account_id);
//
//            
//            var requestParams = {
//                accountID: 100000003,
//                name: COMMON_UTIL.trim(req.body.name),
//                age: COMMON_UTIL.trim(req.body.age),
//                gender: randomGender,
//                country: COMMON_UTIL.trim(req.body.country),
//                neck: COMMON_UTIL.trim(req.body.neck),
//                shoulder: COMMON_UTIL.trim(req.body.shoulder),
//                foot: COMMON_UTIL.trim(req.body.foot),
//                thigh: COMMON_UTIL.trim(req.body.thigh),
//                leg: COMMON_UTIL.trim(req.body.leg),
//                skinType: COMMON_UTIL.trim(req.body.s_type),
//                hairType: COMMON_UTIL.trim(req.body.h_type),
//                topType: COMMON_UTIL.trim(req.body.t_type),
//                bottomType: COMMON_UTIL.trim(req.body.b_type),
//                shoesType: COMMON_UTIL.trim(req.body.shoes_type),
//                clientUID: COMMON_UTIL.trim(req.body.client_uid),
//                signUpPath: COMMON_UTIL.trim(req.body.signup_path)
//            };
//
//            // MYSQL_ADA_ACCOUNT_CONN.procMakeAvatar(requestParams, function (err, results) { // DB 프로시져 로 유저 인포 값을 저장 ?
//                
//                // if (err) {
//                //     PRINT_LOG.setErrorLog("Failed, MYSQL_ADA_ACCOUNT_CONN.procMakeAvatar", err);
//                //     return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
//                // }
//
//                if (!checkParams(API_PATH, clientUID, signUpPath)) {
//                    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
//                    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
//                };
//
//            // })
//
//            // if(app.post("/ada/account/makeAvatar", function(){})){
//
//            //     PRINT_LOG.info(__filename, CLIENT_IP, 'API Call success');
//            // }
//
//            if(requestParams.gender > 0){
//                isRes = 'data saved in DB';
//                PACKET.sendSuccess(req, res, 'search success', {isRes: isRes});
//            } else PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, 'error', {});
//                
//            
//          
//        } catch (catchErr) {
//            PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
//            // PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
//            PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
//        }
//    });

    // app.post("/ada/account/login", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         var signUpPath = COMMON_UTIL.trim(req.body.signup_path);
    //         var clientUID = COMMON_UTIL.trim(req.body.client_uid);
    //         var signupID = COMMON_UTIL.trim(req.body.signup_id);
    //         var pwd = COMMON_UTIL.trim((signUpPath == "adb") ? req.body.password : req.body.signup_id);

    //         //if (!checkParams(API_PATH, clientUID, signupID, pwd, signUpPath)) {
    //         //    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
    //         //    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    //         //}

    //         PRINT_LOG.info(__filename, API_PATH, JSON.stringify(req.body));

    //         MYSQL_ADB_ACCOUNT_CONN.procAccountLogin({
    //             clientUID: clientUID,
    //             clientIP: CLIENT_IP,
    //             signupID: signupID,
    //             accountPWD: crypto.createHash("sha512").update(pwd).digest("base64"),
    //             signUpPath: signUpPath
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procAccountLogin, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }

    //             //var retV = COMMON_UTIL.getMysqlRES(results);
    //             //if (ERROR_CODE_UTIL.RES_SUCCESS !== retV.res) {
    //             //    PRINT_LOG.error(__filename, API_PATH, retV.msg);
    //             //    return PACKET.sendFail(req, res, retV.res);
    //             //}

    //             var row = results[0][0];
    //             //PRINT_LOG.info(__filename, API_PATH, " clientUID parameter " + clientUID);
    //             //PRINT_LOG.info(__filename, API_PATH, " clientUID parameter " + clientUID);
    //             //PRINT_LOG.info(__filename, API_PATH, " clientUID parameter " + clientUID);
    //             //PRINT_LOG.info(__filename, API_PATH, " clientUID parameter " + clientUID);

    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.access_token = row.ACCESS_TOKEN;
    //                 responseObj.account_name = row.ACCOUNT_NAME;
    //                 PACKET.sendSuccess(req, res, "로그인 성공", responseObj);

    //             } else {
    //                 PACKET.sendFail(req, res, row.ERRORCODE, row.MSG, {});

    //             }

    //             //var responseObj = { account_id: 0, access_token: 0, is_allow_app: 0 };
    //             //for (var i = 0, len = results[0].length; i < len; i++) {
    //             //    var row = results[0][i];
    //             //    responseObj.account_id = row.ACCOUNT_ID;
    //             //    responseObj.access_token = row.ACCESS_TOKEN;
    //             //    responseObj.is_allow_app = row.IS_ALLOW_APP;
    //             //    responseObj.email = accountEmail;
    //             //    responseObj.signUpPath = signUpPath;
    //             //}
    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         // PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // app.post("/ada/account/getInfo", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         //var clientUID = COMMON_UTIL.trim(req.body.client_uid);
    //         //var accessToken = COMMON_UTIL.trim(req.body.access_token);
    //         var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;

    //         //PRINT_LOG.info(__filename, API_PATH, " accountID : " + req.body.isAccountID);

    //         MYSQL_ADB_ACCOUNT_CONN.procAccountInfo({
    //             accountID: accountID
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procAccountInfo, faile db, error." + err);
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //             var row = results[0][0];
    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.signupID = row.signupID;
    //                 responseObj.email = row.email;
    //                 responseObj.accountName = row.accountName;
    //                 responseObj.accountImage = (row.accountImage != "") ? COMMON_UTIL.getFileUrlPath(accountID, row.accountImage) : "";
    //                 responseObj.signUpPath = row.signUpPath;
    //                 responseObj.regDatetime = row.regDatetime;
    //                 PACKET.sendSuccess(req, res, "정보조회 성공", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.ERRORCODE, row.MSG, {});

    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // 비밀번호 찾기, 이메일 발송, 메일 계정 회원인 경우 초기화 메일 발송됨.
    // app.post("/adb/account/pwEmail", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         var clientUID = COMMON_UTIL.trim(req.body.client_uid);
    //         var signupID = COMMON_UTIL.trim(req.body.signup_id);            // 초기화할 계정
    //         var signUpPath = COMMON_UTIL.trim(req.body.signup_path);

    //         if ("adb" !== signUpPath) {
    //             return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER, "잘못된 호출입니다." + signUpPath, {});
    //         }
    //         //if (!checkParams(API_PATH, clientUID, signupID, pwd, signUpPath)) {
    //         //    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
    //         //    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    //         //}
    //         // clientUID VARCHAR(64), clientIP VARCHAR(15), signupID VARCHAR(64)

    //         MYSQL_ADB_ACCOUNT_CONN.procFindEmail({
    //             clientUID: clientUID,
    //             clientIP: CLIENT_IP,
    //             signupID: signupID
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procFindEmail, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }

    //             var row = results[0][0];
    //             // apidev.doralab.co.kr",   host
    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.info = signupID;
    //                 responseObj.email_token = row.EMAIL_TOKEN;
    //                 responseObj.account_name = row.ACCOUNT_NAME;
    //                 responseObj.live_time = row.LIVE_TIME;
    //                 responseObj.host = req.host;

    //                 sendMailWelcome(signupID, 1, responseObj);      // type  1 : 비밀번호 초기화

    //                 PACKET.sendSuccess(req, res, "이메일이 발송되었습니다.", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.ERRORCODE, row.MSG, {});
    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // app.post("/ada/account/checkToken", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         //var clientUID = COMMON_UTIL.trim(req.body.client_uid);
    //         //var signUpPath = COMMON_UTIL.trim(req.body.signup_path);
    //         var signup_token = COMMON_UTIL.trim(req.body.signup_token);

    //         MYSQL_ADB_ACCOUNT_CONN.proccheckToken({
    //             signupToken: signup_token
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " proccheckToken, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }

    //             var row = results[0][0];

    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 PACKET.sendSuccess(req, res, "조회 성공", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.RES, row.MSG, {});
    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // app.post("/adb/account/pwChange", ROUTE_MIDDLEWARE.NO_AUTH_APP, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);
    //     try {
    //         //var clientUID = COMMON_UTIL.trim(req.body.client_uid);
    //         //var signUpPath = COMMON_UTIL.trim(req.body.signup_path);
    //         var signup_token = COMMON_UTIL.trim(req.body.signup_token);
    //         var pwd = COMMON_UTIL.trim(req.body.signup_pass);

    //         //if (!checkParams(API_PATH, clientUID, signupID, pwd, signUpPath)) {
    //         //    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
    //         //    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    //         //}

    //         MYSQL_ADB_ACCOUNT_CONN.procpassChange({
    //             signupToken: signup_token,
    //             accountPWD: crypto.createHash("sha512").update(pwd).digest("base64")
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procAccountLogin, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }

    //             var row = results[0][0];
    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.MSG = row.MSG;
    //                 PACKET.sendSuccess(req, res, "업데이트 성공", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.RES, row.MSG, {});
    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // 마이페이지 - 이름변경
    // app.post("/adb/account/modName", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);

    //     try {
    //         var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
    //         var userName = COMMON_UTIL.trim(req.body.set_username);

    //         //if (!checkParams(API_PATH, clientUID, signupID, pwd, signUpPath)) {
    //         //    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
    //         //    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    //         //}

    //         MYSQL_ADB_ACCOUNT_CONN.procUsernameChange({
    //             accountID: accountID,
    //             accountName: userName
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procUsernameChange, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //             var row = results[0][0];

    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.MSG = row.MSG;
    //                 PACKET.sendSuccess(req, res, "업데이트 성공", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.RES, row.MSG, {});
    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // 마이페이지 - 비밀번호변경
    // app.post("/adb/account/modPass", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);

    //     try {
    //         var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
    //         var userPass = COMMON_UTIL.trim(req.body.set_userpass);

    //         PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));

    //         //if (!checkParams(API_PATH, clientUID, signupID, pwd, signUpPath)) {
    //         //    PRINT_LOG.error(__filename, API_PATH, " error parameter " + JSON.stringify(req.body));
    //         //    return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_ERROR_PARAMETER);
    //         //}

    //         MYSQL_ADB_ACCOUNT_CONN.procUserpassChange({
    //             accountID: accountID,
    //             accountPass: crypto.createHash("sha512").update(userPass).digest("base64")
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procUserpassChange, faile db, error");
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB);
    //             }
    //             var row = results[0][0];

    //             if (row.RES == "0") {
    //                 var responseObj = {};
    //                 responseObj.MSG = row.MSG;
    //                 PACKET.sendSuccess(req, res, "업데이트 성공", responseObj);
    //             } else {
    //                 PACKET.sendFail(req, res, row.RES, row.MSG, {});
    //             }

    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, catchErr, {});
    //     }
    // });

    // 마이페이지 - 회원탈퇴
    // app.post("/ada/account/leave", ROUTE_MIDDLEWARE.LOGGED_IN_ACCOUNT, function (req, res) {
    //     var API_PATH = req.route.path;
    //     var CLIENT_IP = COMMON_UTIL.getClientIP(req);

    //     try {
    //         var accountID = (req.body.isAccountID) ? req.body.isAccountID : 0;
    //         PRINT_LOG.info(__filename, API_PATH, " accountID parameter : " + accountID);

    //         MYSQL_ADB_ACCOUNT_CONN.procUserLeave({
    //             accountID: accountID,
    //             clientIP: CLIENT_IP
    //         }, function (err, results) {
    //             if (err) {
    //                 PRINT_LOG.error(__filename, API_PATH, " procUserLeave, faile db, error" + err);
    //                 return PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_DB, err, {});
    //             }
    //             var row = results[0][0];
    //             if (row.RES == 0) {
    //                 PACKET.sendSuccess(req, res, "처리성공", {});
    //             } else {
    //                 PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, "처리실패", { errorCode: row.RES });
    //             }
    //         });
    //     } catch (catchErr) {
    //         PRINT_LOG.setErrorLog("[" + API_PATH + "] error, [" + __filename + "]", catchErr);
    //         PACKET.sendFail(req, res, ERROR_CODE_UTIL.RES_FAILED_UNKNOWN, null, { "errorinfo": catchErr });
    //     }
    // });

};