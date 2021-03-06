var PRINT_LOG = global.PRINT_LOGGER;

function checkConnect(pool, errTitle) {
	// Mysql connection keep alive check
	setInterval(function() {
		try {
			pool.getConnection(function(err, connection) {
				if (err) return PRINT_LOG.setErrorLog(errTitle, err);
				connection.query("SELECT 1", function(connErr) {
					if (!connErr) return connection.release();
					PRINT_LOG.setErrorLog(errTitle + ", connection.query", connErr);
					connection.end();
				});
			});
		} catch (err) {
			PRINT_LOG.setErrorLog("dora_account_query.setInterval catch", err);
		}
	}.bind(this), 10000);
}

function runQS(connection, queryStr, callBack) {
	connection.query(queryStr, function(connErr, rows) {
		connection.release();
		callBack(connErr, rows);
	});
}

// var NDE = require("../database/mysql_slp_nde_connector.js")(checkConnect, runQS);
// var Common = require("../database/mysql_slp_common_connector.js")(checkConnect, runQS);
// var Account = require("../database/mysql_slp_account_connector.js")(checkConnect, runQS);
// var NDE_Info = require("../database/mysql_slp_nde_info_connector.js")(checkConnect, runQS);
// var KwActionLog = require("../database/mysql_slp_kw_action_log_connector.js")(checkConnect, runQS);
var JSU_account = require("../database/mysql_jsu_account_connector.js")(checkConnect, runQS);
var JSU_BOOK = require("../database/mysql_jsu_book_connector.js")(checkConnect, runQS);
var JSU_CLUB = require("../database/mysql_jsu_club_connector.js")(checkConnect, runQS);
// var JSU = require("../database/mysql_jsu_connector")(checkConnect, runQS);
// var Account = require("../database/mysql_adb_account_connector.js")(checkConnect, runQS);       // ADB ACCOUNT

// DB Connector
global.MYSQL_CONNECTOR_POOLS = {
	JSU_account: new JSU_account(),
	JSU_BOOK: new JSU_BOOK(),
    JSU_CLUB: new JSU_CLUB()
    // JSU: new JSU(),
	// ADB_ACCOUNT: new Account()  //,
	// SLP_NDE: new NDE()
    // SLP_COMMON: new Common(),
    // SLP_ACCOUNT: new Account(),
	// SLP_NDE_INFO: new NDE_Info(),
	// SLP_KW_ACTION_LOG: new KwActionLog()
};