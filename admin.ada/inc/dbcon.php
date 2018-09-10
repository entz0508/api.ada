<?
	$database_url = "localhost";			// 35.194.222.5
	$database_name = "ada_account_db";
	$database_id = "fitadadev";
	$database_pw = "qmffndkzm!!!!";
	$database_port = "16612";

	//$db = mysqli_connect($database_url,$database_id,$database_pw) or die("DB error");
	$db = mysqli_connect($database_url,$database_id,$database_pw,$database_name,$database_port) or die("DB error");
	//mysqli_select_db($db, $database_name);
		
	if(!$db) {
		echo mysql_errno().":";
		echo mysql_error()."<br>";
	}
?>
