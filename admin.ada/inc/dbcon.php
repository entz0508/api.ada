<?
	$database_url = "gnm-adb.cbpyqzjjgzzg.ap-northeast-2.rds.amazonaws.com:16612";
	$database_name = "adb_db";
	$database_id = "maseradb";
	$database_pw = "gdpsdpa%6&8";

	$db = mysqli_connect($database_url,$database_id,$database_pw) or die("DB error");
	mysqli_select_db($db, $database_name);
		
	if(!$db) {
		echo mysql_errno().":";
		echo mysql_error()."<br>";
	}
?>
