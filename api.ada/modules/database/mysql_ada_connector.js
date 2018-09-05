/**
 * Created by kkuris on 2018-05-14.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: global.CONFIG.MYSQL_FIT_ADA.HOST,
    port: global.CONFIG.MYSQL_FIT_ADA.PORT,
    user: global.CONFIG.MYSQL_FIT_ADA.USER,
    password: global.CONFIG.MYSQL_FIT_ADA.PASSWORD,
    database: global.CONFIG.MYSQL_FIT_ADA.DATABASE,
    connectionLimit: 3
});

module.exports = function(checkConnect, runQS) {
    function MYSQL_FIT_ADA_CONN() {
        checkConnect(pool, "MYSQL_FIT_ADA.setInterval, pool.getConnection");
    }

    MYSQL_FIT_ADA_CONN.prototype.procWatchdogPing = function(callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            connection.query(" SELECT 1 AS `RES` ", function(connErr) {
                connection.release();
                callBack(connErr, !connErr);
            });
        });
    };

    // MYSQL_SLP_NDE.prototype.procIsLoggedIn = function(appID, os, clientUID, userID, userAccessToken, slpAccountID, slpAccountAccessToken, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spIsLoggedIn( " + Number(appID) + ", " + connection.escape(os) + ", " +
    //             connection.escape(clientUID) + ", " + Number(slpAccountID) + " , " + connection.escape(slpAccountAccessToken) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    MYSQL_FIT_ADA_CONN.prototype.procQueryTest = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL sp_test_proc(" + connection.escape(requestParams.os) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procBoutiqueMain = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetSalesList(" + Number(requestParams.searchType) + " , " +
                Number(requestParams.categoryVal) + " , " +
                Number(requestParams.subcategoryVal) + " , " +
                Number(requestParams.collecionVal) + " , " +
                Number(requestParams.brandVal) + " , " +
                Number(requestParams.styleVal) + " , " +
                Number(requestParams.colorVal) + " , " +
                Number(requestParams.featuredVal) + " , " +
                Number(requestParams.sortType) + " , " +
                Number(requestParams.pageVal) + " , " +
                Number(requestParams.appendVal) + " , " +
                Number(requestParams.genderID) + " , " +
                Number(requestParams.accountID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };
    
    MYSQL_FIT_ADA_CONN.prototype.procBoutiqueMain2 = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetSalesList2(" + Number(requestParams.searchType) + " , " +
                Number(requestParams.categoryVal) + " , " +
                Number(requestParams.subcategoryVal) + " , " +
                Number(requestParams.collecionVal) + " , " +
                Number(requestParams.brandVal) + " , " +
                Number(requestParams.styleVal) + " , " +
                Number(requestParams.colorVal) + " , " +
                Number(requestParams.featuredVal) + " , " +
                Number(requestParams.sortType) + " , " +
                Number(requestParams.pageVal) + " , " +
                Number(requestParams.appendVal) + " , " +
                Number(requestParams.genderID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };


    MYSQL_FIT_ADA_CONN.prototype.procSaleTagList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetSalesTagList(" + Number(requestParams.searchType) + " , " +
                Number(requestParams.categoryVal) + " , " +
                Number(requestParams.subcategoryVal) + " , " +
                Number(requestParams.collecionVal) + " , " +
                Number(requestParams.brandVal) + " , " +
                Number(requestParams.styleVal) + " , " +
                Number(requestParams.colorVal) + " , " +
                Number(requestParams.featuredVal) + " , " +
                Number(requestParams.genderID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };
    
//    MYSQL_FIT_ADA_CONN.prototype.procBoutiqueMain = function(requestParams, callBack) {
//        pool.getConnection(function(err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL sp_test_boutique_main(" + Number(requestParams.pdt_id) + " )";
//            runQS(connection, queryStr, callBack);
//        });
//    };

    MYSQL_FIT_ADA_CONN.prototype.procBoutiqueProductDetail = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetSalesDetail(" + Number(requestParams.salesID) + " , " +
                    Number(requestParams.accountID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procCategoryList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetCategoryList("+ Number(requestParams.brandID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetBannerList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL spGetBannerList( " + Number(requestParams.placeID) + ", " +
                    Number(requestParams.brandID) + " , " +
                    Number(requestParams.genderID) + " , " +
                    Number(requestParams.age) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetContentsView = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL spGetContentDetail( " + Number(requestParams.contentID) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };
//
//    MYSQL_FIT_ADA_CONN.prototype.procDressRoom = function(requestParams, callBack) {
//        pool.getConnection(function(err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL sp_test_dress_room()" ;
//            runQS(connection, queryStr, callBack);
//        });
//    };
//

//    MYSQL_FIT_ADA_CONN.prototype.procDressRoom = function(requestParams, callBack) {
//        pool.getConnection(function(err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL sp_test_dressRoom(" + Number(requestParams.accountID)  + " )" ;
//            runQS(connection, queryStr, callBack);
//        });
//    };


    MYSQL_FIT_ADA_CONN.prototype.procTestArr = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL sp_test_arrary()" ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetBrandList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetBrandList(" + Number(requestParams.genderID) + ")" ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetBrandDetail = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetBrandDetail(" + Number(requestParams.brandID) + ")" ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetBrandPage = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL sp_test_brand_page(" + Number(requestParams.brandID) + ")" ;
            runQS(connection, queryStr, callBack);
        });
    };

 
    MYSQL_FIT_ADA_CONN.prototype.procGetFeaturedList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetFeaturedList("+ Number(requestParams.genderID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procGetFeaturedDetail = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetFeaturedDetail("+ Number(requestParams.featuredID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

//    MYSQL_FIT_ADA_CONN.prototype.procTestQuery = function(requestParams, callBack) {
//        pool.getConnection(function(err, connection) {
//            if (err) return callBack(err);
//            var queryStr = "CALL sp_test_multiquery()";
//            runQS(connection, queryStr, callBack);
//        });
//    };
    
    MYSQL_FIT_ADA_CONN.prototype.procWishEdit = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spWishEdit(" + Number(requestParams.accountID) + " , "  +
                    Number(requestParams.saleID) + " , "  +
                    Number(requestParams.wishType) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procLikeEdit = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spLikeEdit(" + Number(requestParams.accountID) + " , "  +
                    Number(requestParams.saleID) + " , " +
                    Number(requestParams.likeType) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procCartEdit = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spCartEdit(" + Number(requestParams.accountID) + " , "  +
                    Number(requestParams.saleID) + " , "  +
                    Number(requestParams.subitemID) + " , "  +
                    Number(requestParams.actionType) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };
    
    MYSQL_FIT_ADA_CONN.prototype.procBuyAll = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spCartBuy(" + Number(requestParams.accountID) + " , " +
                    connection.escape(requestParams.cartIDs) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };
    
    MYSQL_FIT_ADA_CONN.prototype.procCartDelete = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spCartDrop(" + Number(requestParams.accountID) + " , "  +
                    Number(requestParams.cartID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_FIT_ADA_CONN.prototype.procWishList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetWishList(" + Number(requestParams.accountID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };
    
     MYSQL_FIT_ADA_CONN.prototype.procWishList2 = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = "CALL spGetWishList2(" + Number(requestParams.accountID) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

     MYSQL_FIT_ADA_CONN.prototype.procCartList = function(requestParams, callBack) {
        pool.getConnection(function(err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL spGetCartList( " + Number(requestParams.accountID) + ", " +
                    Number(requestParams.searchType) + " , " +
                    Number(requestParams.pageVal) + " , " +
                    Number(requestParams.appendVal) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    //
    // MYSQL_SLP_NDE.prototype.procShopGetGooglePayload = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spShopGetGooglePayload( " + Number(requestParams.appID) + ", " +
    //             connection.escape(requestParams.os) + ", " +
    //             connection.escape(requestParams.clientUID) + ", " +
    //             Number(requestParams.userID) + ", " +
    //             connection.escape(requestParams.userAccessToken) + ", " +
    //             Number(requestParams.slpAccountID) + ", " +
    //             connection.escape(requestParams.slpAccountAccessToken) + ", " +
    //             connection.escape(requestParams.build) + ", " +
    //             connection.escape(requestParams.store) + ", " +
    //             Number(requestParams.packageID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    //
    // MYSQL_SLP_NDE.prototype.procShopGoogleConsume = function(requestParams, payload, orderID, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spShopGoogleConsume( " + Number(requestParams.appID) + ", " +
    //             connection.escape(requestParams.os) + ", " +
    //             connection.escape(requestParams.clientUID) + ", " +
    //             Number(requestParams.userID) + ", " +
    //             connection.escape(requestParams.userAccessToken) + ", " +
    //             Number(requestParams.slpAccountID) + ", " +
    //             connection.escape(requestParams.slpAccountAccessToken) + ", " +
    //             connection.escape(requestParams.build) + ", " +
    //             connection.escape(requestParams.store) + ", " +
    //             Number(requestParams.packageID) + ", " +
    //             connection.escape(payload) + ", " +
    //             connection.escape(orderID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procShopAppleConsume = function(requestParams, payload, orderID, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spShopAppleConsume( " + Number(requestParams.appID) + ", " +
    //             connection.escape(requestParams.os) + ", " +
    //             connection.escape(requestParams.clientUID) + ", " +
    //             Number(requestParams.userID) + ", " +
    //             connection.escape(requestParams.userAccessToken) + ", " +
    //             Number(requestParams.slpAccountID) + ", " +
    //             connection.escape(requestParams.slpAccountAccessToken) + ", " +
    //             connection.escape(requestParams.build) + ", " +
    //             connection.escape(requestParams.store) + ", " +
    //             Number(requestParams.packageID) + ", " +
    //             connection.escape(payload) + ", " +
    //             connection.escape(orderID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    // //
    // // MYSQL_SLP_NDE.prototype.procAddPhotos = function(requestParams, serverIdx, destPathIdx, imageDefaultFileName, imageThumbnailFileName, callBack) {
    // // 	pool.getConnection(function(err, connection) {
    // // 		if (err) return callBack(err);
    // // 		var queryStr = " CALL spAddPhotos( " + Number(requestParams.appID) + ", " +
    // // 			connection.escape(requestParams.os) + ", " +
    // // 			connection.escape(requestParams.clientUID) + ", " +
    // // 			Number(requestParams.slpAccountID) + ", " +
    // // 			connection.escape(requestParams.slpAccountAccessToken) + ", " +
    // // 			Number(requestParams.profileID) + ", " +
    // // 			connection.escape(requestParams.episode_id) + ", " +
    // // 			Number(requestParams.curUnixtime) + ", " +
    // // 			Number(serverIdx) + ", " +
    // // 			Number(destPathIdx) + ", " +
    // // 			connection.escape(imageDefaultFileName) + ", " +
    // // 			connection.escape(imageThumbnailFileName) + " ) ";
    // // 		runQS(connection, queryStr, callBack);
    // // 	});
    // // };
    //
    //
    // MYSQL_SLP_NDE.prototype.procGetPhotosList = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spGetPhotosList( " + Number(requestParams.appID) + ", " +
    //             connection.escape(requestParams.os) + ", " +
    //             connection.escape(requestParams.clientUID) + ", " +
    //             Number(requestParams.slpAccountID) + ", " +
    //             connection.escape(requestParams.slpAccountAccessToken) + ", " +
    //             Number(requestParams.profileID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // MYSQL_SLP_NDE.prototype.procGetCategoryRotationList = function(requestParams, callBack) {
    // // 	pool.getConnection(function(err, connection) {
    // // 		if (err) return callBack(err);
    // // 		var queryStr = " CALL spGetCategoryRotationRewardList( " + Number(requestParams.appID) + " , " +
    // // 			Number(requestParams.accountID) + " , " +
    // // 			Number(requestParams.profileID) + " ) ";
    // // 		runQS(connection, queryStr, callBack);
    // // 	});
    // // };
    // //
    // // MYSQL_SLP_NDE.prototype.procCategoryRotationRewardRequest = function(requestParams, callBack) {
    // // 	pool.getConnection(function(err, connection) {
    // // 		if (err) return callBack(err);
    // // 		var queryStr = " CALL spGetCategoryRotationRewardRequest( " + Number(requestParams.appID) + " , " +
    // // 			Number(requestParams.accountID) + " , " +
    // // 			Number(requestParams.profileID) + " , " +
    // // 			connection.escape(requestParams.categoryID) + " ) ";
    // // 		runQS(connection, queryStr, callBack);
    // // 	});
    // // };
    // //
    // // MYSQL_SLP_NDE.prototype.procCategoryRotationRewardHistory = function(requestParams, callBack) {
    // // 	pool.getConnection(function(err, connection) {
    // // 		if (err) return callBack(err);
    // // 		var queryStr = " CALL spGetCategoryRotationRewardHistory( " + Number(requestParams.appID) + " , " +
    // // 			Number(requestParams.accountID) + " , " +
    // // 			Number(requestParams.profileID) + " ) ";
    // // 		runQS(connection, queryStr, callBack);
    // // 	});
    // // };
    //
    //
    // MYSQL_SLP_NDE.prototype.procGetTopRankEpisodePlay = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spGetTopRankEpisodePlay( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.accountID) + " , " +
    //             Number(requestParams.searchLimit) + " , " +
    //             connection.escape(requestParams.searchBoundary) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procEpisodeBegining = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sp_episode_begining( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.accountID) + " , " +
    //             connection.escape(requestParams.seqID) + " , " +
    //             connection.escape(requestParams.beginDate) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procEpisodeBeginings = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sp_episode_beginings( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.stepAttendID) + " , " +
    //             connection.escape(requestParams.beginDate) + " , " +
    //             connection.escape(requestParams.endDate) + " , " +
    //             connection.escape(requestParams.bluearkUid) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // APP���� �ӽ����� ����
    // MYSQL_SLP_NDE.prototype.procBuyTempCreate = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBuyTempCreate( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.accountID) + " , " +
    //             connection.escape(requestParams.encUserID) + " , " +
    //             connection.escape(requestParams.os) + " , " +
    //             connection.escape(requestParams.productID) + " , " +
    //             Number(requestParams.exProductID) + " , " +
    //             connection.escape(requestParams.payMethod) + " , " +
    //             connection.escape(requestParams.reciept) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // �� ���ŷ��� - ��������
    // MYSQL_SLP_NDE.prototype.procBuyProduct = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBuyProduct( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.accountID) + " , " +
    //             Number(requestParams.period) + " , " +
    //             connection.escape(requestParams.os) + " , " +
    //             connection.escape(requestParams.productID) + " , " +
    //             connection.escape(requestParams.reciept) + " , " +
    //             connection.escape(requestParams.title) + " ) ";
    //
    //         // + " , " +
    //         //Number(requestParams.point) + " , " +
    //         //connection.escape(requestParams.periodType) + " , " +
    //         //connection.escape(requestParams.payMethod) + " , " +
    //         //connection.escape(requestParams.usingUnit) + " , " +
    //         //connection.escape(requestParams.goodsIDs) + " , " +
    //         //Number(requestParams.goodsCount) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� ����ó��
    // /*
    //  appID bigint,
    //  bluearkUid VARCHAR(40),
    //  extPdtID int,
    //  stepAttendID int,
    //  buyID int,
    //  buyIP varchar(15)
    //  */
    // MYSQL_SLP_NDE.prototype.procOpenBuyProduct = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spOpenBuyProduct( " + Number(requestParams.appID) + " , " +
    //             connection.escape(requestParams.bluearkUid) + " , " +
    //             Number(requestParams.extPdtID) + " , " +
    //             Number(requestParams.stepAttendID) + " , " +
    //             Number(requestParams.buyID) + " , " +
    //             connection.escape(requestParams.buyIP) + " ) ";
    //
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procGetBuyHistory = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spGetBuyHistory(  " + Number(requestParams.appID) + ", " +
    //             Number(requestParams.accountID) + ") ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procGetEpisodePermList = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spGetEpisodePermList( " + Number(requestParams.appID) + " , " +
    //             Number(requestParams.accountID) + " , " +
    //             Number(requestParams.seqID) + " ) ";
    //         console.log("\n## procGetEpisodePermList queryStr ##");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procServerPing_nde = function(requestParams, callBack) {
    //     pool.getConnection(function(err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sp_get_server_ping_nde( " + Number(requestParams.appID) + " ) ";
    //
    //         console.log("\n## procServerPing_nde queryStr ##");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procRefundPermition = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spRefundPermition( " + Number(requestParams.seqID) + " , " +
    //             Number(requestParams.accountID) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // MYSQL_SLP_NDE.prototype.procOpenRefundProduct = function (requestParams, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spOpenRefundPermition( " + Number(requestParams.stepAttendID) + " , " +
    //             Number(requestParams.refundID) + " , " +
    //             connection.escape(requestParams.refundStatCD) + " , " +
    //             connection.escape(requestParams.refundRsnCD) + " , " +
    //             connection.escape(requestParams.refundTime) + " , " +
    //             Number(requestParams.refundAmt) + " , " +
    //             connection.escape(requestParams.bluearkUid) + " ) ";
    //         // connection.escape(requestParams.buyIP) + " ) ";
    //         console.log("\n queryStr");
    //         console.log(queryStr);
    //         runQS(connection, queryStr, callBack);
    //     });
    // };

    return MYSQL_FIT_ADA_CONN;
};