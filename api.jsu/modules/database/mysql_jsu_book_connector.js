/**
 * Created by kkuris on 2018-04-25.
 */
/**
 * Created by kkuris on 2018-04-12.
 */
/**
 * Created by kkuris on 2018-03-27.
 */
// checked by J
var mysql = require('mysql');
var pool = mysql.createPool({
    host: global.CONFIG.MYSQL_JSU_BOOK.HOST,
    port: global.CONFIG.MYSQL_JSU_BOOK.PORT,
    user: global.CONFIG.MYSQL_JSU_BOOK.USER,
    password: global.CONFIG.MYSQL_JSU_BOOK.PASSWORD,
    database: global.CONFIG.MYSQL_JSU_BOOK.DATABASE,
    connectionLimit: 3
});

module.exports = function(checkConnect, runQS) {
    function MYSQL_JSU_BOOK_CONN() {
        checkConnect(pool, "MYSQL_JSU_CONN.setInterval, pool.getConnection");
    }

    MYSQL_JSU_BOOK_CONN.prototype.procWatchdogPing = function (callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            connection.query(" SELECT 1 AS `RES` ", function (connErr) {
                connection.release();
                callBack(connErr, !connErr);
            });
        });
    };

    // ȸ������ - �̸����ߺ� �߰�
    MYSQL_JSU_BOOK_CONN.prototype.procBookSearch = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_book_search(  " + connection.escape(params.accessToken) + ", " +
                connection.escape(params.list_type) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procBookSearchDetail = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_book_search_detail(  " + connection.escape(params.accessToken) + ", " +
                Number(params.book_id) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procBookSearchKeyword = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_book_keyword_search(  " + connection.escape(params.accessToken) + ", " +
                connection.escape(params.keyWord) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };


    MYSQL_JSU_BOOK_CONN.prototype.procBookmarkEdit = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_bookmark_edit(  " + Number(params.bookID) + ", " +
                connection.escape(params.accessToken) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procMypageBookmark = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_get_bookmark_list(  " + connection.escape(params.accessToken) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procMypageMain = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_get_mypage(  " + connection.escape(params.accessToken) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procMypageAudioBookList = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_get_rent_audiobook_list(  " + connection.escape(params.accessToken) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procRentBook = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_book_rent(  " + connection.escape(params.accessToken) + " , " +
                Number(params.bookID) + " , " +
                Number(params.clubID) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procReturnBook = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_return_book(  " + connection.escape(params.accessToken) + " , " +
                Number(params.bookID) + " , " +
                Number(params.clubID) + " ) ";
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procReadingBookMain = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_get_reading_book_list_main(  " + connection.escape(params.accessToken) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    MYSQL_JSU_BOOK_CONN.prototype.procReadingBookList = function (params, callBack) {
        pool.getConnection(function (err, connection) {
            if (err) return callBack(err);
            var queryStr = " CALL sp_test_get_reading_book_list(  " + connection.escape(params.accessToken) + " ) " ;
            runQS(connection, queryStr, callBack);
        });
    };

    // �α���
    // MYSQL_JSU_CONN.prototype.procAccountLogin = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spAccountLogin(  " + connection.escape(params.clientUID) + ", " +
    //             connection.escape(params.CLIENT_IP) + ", " +
    //             connection.escape(params.signupID) + ", " +
    //             connection.escape(params.accountPWD) + ", " +
    //             connection.escape(params.signUpPath) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ��������ȸ
    // MYSQL_JSU_CONN.prototype.procAccountInfo = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spaccountInfo( " + Number(params.accountID) + ") ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    //
    // // ������� - �̸���ã��
    // MYSQL_JSU_CONN.prototype.procFindEmail = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spfindEmail(  " + connection.escape(params.clientUID) + ", " +
    //             connection.escape(params.clientIP) + ", " +
    //             connection.escape(params.signupID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ������� - �̸�����ū üũ
    // MYSQL_JSU_CONN.prototype.proccheckToken = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spcheckToken(  " + connection.escape(params.signupToken) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ������� - ��� ����ó�� with token
    // MYSQL_JSU_CONN.prototype.procpassChange = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sppassChange(  " + connection.escape(params.signupToken) + ", " +
    //             connection.escape(params.accountPWD) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� - �̸�����
    // MYSQL_JSU_CONN.prototype.procUsernameChange = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spAccountnameChange(  " + Number(params.accountID) + ", " +
    //             connection.escape(params.accountName) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� - �������
    // MYSQL_JSU_CONN.prototype.procUserpassChange = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spAccountpassChange(  " + Number(params.accountID) + ", " +
    //             connection.escape(params.accountPass) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� - ��������
    // MYSQL_JSU_CONN.prototype.procUserphotoChange = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spAccountMyphotoChange(  " + Number(params.accountID) + ", " +
    //             connection.escape(params.imageName) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� - ȸ��Ż��
    // MYSQL_JSU_CONN.prototype.procUserLeave = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spAccountLeave(  " + Number(params.accountID) + ", " +
    //             connection.escape(params.clientIP) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� Edit - ���̶���Ʈ, �ϸ�ũ ��� - OLD
    // MYSQL_JSU_CONN.prototype.procBibleEdit = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spbibleEdit(  " + Number(params.accountID) + ", " +
    //             Number(params.bibleID) + ", " +
    //             Number(params.chapterID) + ", " +
    //             Number(params.verseID) + ", " +
    //             Number(params.editType) + ", " +
    //             connection.escape(params.editValue) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� Edit - �ϸ�ũ ���/����
    // MYSQL_JSU_CONN.prototype.procBookmarkEdit = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBookmarkEdit(  " + Number(params.accountID) + ", " +
    //             Number(params.bibleID) + ", " +
    //             Number(params.chapterID) + ", " +
    //             Number(params.verseID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� Edit - ���̶���Ʈ ���/����
    // MYSQL_JSU_CONN.prototype.procHighlightEdit = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spHighlightEdit(  " + Number(params.accountID) + ", " +
    //             Number(params.bibleID) + ", " +
    //             Number(params.chapterID) + ", " +
    //             connection.escape(params.verseID) + ", " +
    //             connection.escape(params.titleStr) + ", " +
    //             connection.escape(params.editValue) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // BIBLE ��Ʈ ���
    // MYSQL_JSU_CONN.prototype.procBibleNoteAdd = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleNoteReg(  " + Number(params.accountID) + ", " +
    //             connection.escape(params.titleStr) + ", " +
    //             connection.escape(params.contentStr) + ", " +
    //             Number(params.bibleID) + ", " +
    //             Number(params.chapterID) + ", " +
    //             Number(params.verseID) + ", " +
    //             Number(params.verseID2) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // BIBLE ��Ʈ ����
    // MYSQL_JSU_CONN.prototype.procBibleNoteMod = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleNoteMod(  " + Number(params.noteID) + ", " +
    //             Number(params.accountID) + ", " +
    //             connection.escape(params.titleStr) + ", " +
    //             connection.escape(params.contentStr) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // BIBLE ��Ʈ ����
    // MYSQL_JSU_ACCOUNT_CONN.prototype.procBibleNoteDel = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleNoteDel(  " + Number(params.noteID) + ", " +
    //             Number(params.accountID)  + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ����play - ���̶���Ʈ, �ϸ�ũ ������ȸ
    // MYSQL_JSU_CONN.prototype.procBibleRead = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleRead(  " + connection.escape(params.accountID) + ", " +
    //             connection.escape(params.bibleID) + ", " +
    //             connection.escape(params.chapterID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� �б� ���
    // MYSQL_JSU_CONN.prototype.procPlayLogAdd = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spPlayLogAdd(  " + Number(params.accountID) + ", " +
    //             Number(params.bibleID) + ", " +
    //             Number(params.chapterID) + ", " +
    //             Number(params.communityID) + ", " +
    //             Number(params.detailID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� ����ã�� by bible
    // MYSQL_JSU_CONN.prototype.procSearchBible = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spSearchBible(" + connection.escape(params.searchStr) + ") ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� ����ã�� by verse
    // MYSQL_JSU_CONN.prototype.procSearchVerse = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spSearchVerse(  " + Number(params.bibleID) + ", " +
    //             connection.escape(params.searchStr) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���� ����ã�� by verse - more
    // MYSQL_JSU_CONN.prototype.procSearchVersemore = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spSearchVerseMore(" + Number(params.bibleID) + ", " +
    //             connection.escape(params.searchStr) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.readcount) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� �ֱ� 100��
    // MYSQL_JSU_CONN.prototype.procMypageHistory = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spMypageHistory(" + Number(params.accountID) + ") ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� �ϸ�ũ ����Ʈ - more - OLD
    // // `spbookmarkListMore`(accountID int, lastID int, lastID2 int, readcount int, sorttype int)
    // MYSQL_JSU_CONN.prototype.procMypageBookmarkmore = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spbookmarkListMore(" + Number(params.accountID) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.lastID2) + ", " +
    //             Number(params.readcount) + ", " +
    //             Number(params.sorttype) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� �ϸ�ũ ����Ʈ - more NEW
    // MYSQL_JSU_CONN.prototype.procMypageBookmark = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spbookmarkList(" + Number(params.accountID) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.readcount) + ", " +
    //             Number(params.sorttype) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ���̶���Ʈ ����Ʈ - more - OLD
    // MYSQL_JSU_CONN.prototype.procMypageHighlightmore = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sphighlightListMore(" + Number(params.accountID) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.lastID2) + ", " +
    //             Number(params.readcount) + ", " +
    //             Number(params.sorttype) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ���̶���Ʈ ����Ʈ - more NEW
    // MYSQL_JSU_CONN.prototype.procMypageHighlight = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL sphighlightList(" + Number(params.accountID) + ", " +
    //             connection.escape(params.lastID) + ", " +
    //             Number(params.readcount) + ", " +
    //             Number(params.sorttype) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ���̶���Ʈ �󼼺��� - more NEW
    // MYSQL_JSU_CONN.prototype.procHighlightLogView = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spHighlightLogView(" + Number(params.accountID) + ", " +
    //             Number(params.highlightID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ���̶���Ʈ ����Ʈ �α� ���� - NEW
    // MYSQL_JSU_CONN.prototype.procMypageHighlightLogDel = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spHighlightDel(" + Number(params.accountID) + ", " +
    //             connection.escape(params.deleteID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ��Ʈ ����Ʈ - more
    // MYSQL_JSU_CONN.prototype.procMypageNotemore = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleNoteListMore(" + Number(params.accountID) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.readcount) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� ��Ʈ ����
    // MYSQL_JSU_CONN.prototype.procMypageNoteView = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spBibleNoteView(" + Number(params.accountID) + ", " +
    //             Number(params.noteID) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // ���������� �б��� ����Ʈ - more
    // MYSQL_JSU_CONN.prototype.procMypageLogmore = function (params, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spPlaylogListMore(" + Number(params.accountID) + ", " +
    //             Number(params.lastID) + ", " +
    //             Number(params.readcount) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };
    //
    // // route_middleware - ��ū����ó��
    // MYSQL_JSU_CONN.prototype.procIsLoginUserAccount = function (clientUID, accessToken, callBack) {
    //     pool.getConnection(function (err, connection) {
    //         if (err) return callBack(err);
    //         var queryStr = " CALL spIsLoginUserAccount(  " + connection.escape(clientUID) + ", " +
    //             connection.escape(accessToken) + " ) ";
    //         runQS(connection, queryStr, callBack);
    //     });
    // };

    return MYSQL_JSU_BOOK_CONN;
};