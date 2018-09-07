<?
	$database_url = "localhost";
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

/*
	$connect=mysqli_connect($database_url,$database_id,$database_pw,$database_name) or die("Mysql Connect Error " . mysqli_error($connect));
	mysqli_query($connect,"set names euckr");

	if(mysqli_errno($connect)) {
		echo"Mysqli Connect Error";
		exit;
	}
*/
?>
