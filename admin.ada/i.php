<?
    $database_url = "localhost:16612";
	$database_name = "ada_account_db";
	$database_id = "fitadadev";
	$database_pw = "qmffndkzm!!!!";

    // mysqli_connect($db_host,$db_user,$db_pass,$db_database,$db_port);
    //$connect=mysqli_connect($database_url,$database_id,$database_pw,$database_name) or die("Mysql Connect Error " . mysqli_error($connect));
    
    $connect=mysqli_connect("localhost",$database_id,$database_pw,$database_name,16612) or die("Mysql Connect Error " . mysqli_error($connect));
	mysqli_query($connect,"set names euckr");

	if(mysqli_errno($connect)) {
		echo"Mysqli Connect Error";
		exit;
	}
?>
<?//=phpinfo() ?>