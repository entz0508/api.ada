/////**
//// * Created by kkuris on 2018-05-14.
//// */
var mysql = require('mysql');
var pool = mysql.createPool ({
    host: global.CONFIG.MYSQL_FIT_ADA_ACCOUNT.HOST,
    port: global.CONFIG.MYSQL_FIT_ADA_ACCOUNT.PORT,
    user: global.CONFIG.MYSQL_FIT_ADA_ACCOUNT.USER,
    password: global.CONFIG.MYSQL_FIT_ADA_ACCOUNT.PASSWORD,
    database: global.CONFIG.MYSQL_FIT_ADA_ACCOUNT.DATABASE,
    connectionLimit: 3
});

module.exports = function (checkConnect, runQS) {
    function MYSQL_FIT_ADA_ACCOUNT_CONN() {
        checkConnect(pool, "MYSQL_FIT_ADA_ACCOUNT.setInterval, pool.getConnection");
    }

    MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procWatchdogPing = function (callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            connection.query(" SELECT 1 AS `RES` ", function (connErr) {
                connection.release();
                callBack(connErr, !connErr);
            });
        });
    };

    MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procQueryTest = function (requestParams, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL sp_test_proc(" + connection.escape(requestParams.os) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };
    
  MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procDressRoom = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL sp_test_dressRoom(" + Number(requestParams.accountID)  + " )" ;
            runQS(connection, queryStr, callBack);
        });
    };


//    MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procBoutiqueMain = function (requestParams, callBack) {
//        pool.getConnection(function (err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL spGetSalesList(" + Number(requestParams.searchType) + " , " +
//                Number(requestParams.categoryVal) + " , " +
//                Number(requestParams.subcategoryVal) + " , " +
//                Number(requestParams.collecionVal) + " , " +
//                Number(requestParams.brandVal) + " , " +
//                Number(requestParams.styleVal) + " , " +
//                Number(requestParams.featuredVal) + " , " +
//                Number(requestParams.colorVal) + " , " +
//                Number(requestParams.sortType) + " , " +
//                Number(requestParams.pageVal) + " , " +
//                Number(requestParams.appendVal) + " , " +
//                Number(requestParams.genderID) + " ) ";
//            runQS(connection, queryStr, callBack);
//        });
//    };

//MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procTestAccountJoin = function (signupPath, signupID, callBack) {
//        pool.getConnection(function (err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL sp_test_proc_account_join(" + connection.escape(signupPath) + " , "
//                                + connection.escape(signupID) + " ) " ;
//            runQS(connection, queryStr, callBack);
//        });
//};

MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procAccountJoin = function (requestParams, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spAccountCreate(" + connection.escape(requestParams.clientUID) + " , "
                                + connection.escape(requestParams.country) + " , " 
                                + connection.escape(requestParams.signUpPath) + " , " 
                                + connection.escape(requestParams.signUpID) + " , " 
                                + connection.escape(requestParams.nickName) + " , " 
                                + Number(requestParams.age) + " , " 
                                + Number(requestParams.gender) + " , " 
                                + Number(requestParams.head) + " , " 
                                + Number(requestParams.armL) + " , " 
                                + Number(requestParams.armB) + " , " 
                                + Number(requestParams.legL) + " , " 
                                + Number(requestParams.legB) + " , "
                                + Number(requestParams.skin) + " , " 
                                + Number(requestParams.hair) + " , " 
                                + Number(requestParams.top) + " , " 
                                + Number(requestParams.bottom) + " , " 
                                + Number(requestParams.shoes) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
        
        //CALL spAccountCreate(<{clientUID}>, <{country VARCHAR(2)}>, <{signUpPath VARCHAR(20)}>, <{signUpID VARCHAR(64)}>, <{nickName VARCHAR(20)}>, <{age int}>, <{gender int}>, <{head int}>, <{armL int}>, <{armB int}>, <{legL int}>, <{legB int}>, <{skin int}>, <{hair int}>, <{top int}>, <{bottom int}>, <{shoes int}>);
        
};

MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procAccountLogin = function (signUpPath, signupID, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spAccountLogin(" + connection.escape(signUpPath) + " , "
                                + connection.escape(signupID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
};

MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procAccountInfo = function (accountID, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spaccountInfo(" + Number(accountID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
};

//
//MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procTestAccountLeave = function (signupPath, accountID, callBack) {
//        pool.getConnection(function (err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL signupID(" + connection.escape(signupPath) + " , "
//                                + connection.escape(accountID) + " ) " ;
//            runQS(connection, queryStr, callBack);
//        });
//};
    
//  MYSQL_SLP_NDE.prototype.procIsLoggedIn = function(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, callBack) {
//         pool.getConnection(function(err, connection) {
//             if (err) return callBack(err);
//             var queryStr = " CALL spIsLoggedIn( " + Number(appID) + ", " + connection.escape(os) + ", " +
//                 connection.escape(clientUID) + ", " + Number(slpAccountID) + " , " + connection.escape(slpAccountAccessToken) + " ) ";
//             runQS(connection, queryStr, callBack);
//         });
//     };    
    
    // route_middleware - 토큰인증처리
    MYSQL_FIT_ADA_ACCOUNT_CONN.prototype.procIsLoginUserAccount = function (clientUID, accessToken, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL spIsLoginUserAccount(  " + connection.escape(clientUID) + ", " +
                connection.escape(accessToken) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };
    

    return MYSQL_FIT_ADA_ACCOUNT_CONN;
};