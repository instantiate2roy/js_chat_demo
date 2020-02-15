<?php

include_once ('../DB_connection/connection.php');
include_once ('functions.php');


echo json_encode(attempt_login());

function attempt_login() {
    $result;
    $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);
    if ($method != 'POST') {
        $result['login_status'] = 'FAILED';
        $result['error_msg'] = 'Invaid Request Method';
        return $result;
    }
	$postdata = file_get_contents("php://input");
	$request_data = json_decode($postdata);
	
	$username=$request_data->user;
	$password=$request_data->pass;
	$is_valid_user=validate_login($username,$password);
	if($is_valid_user){
		$result['login_status'] = 'SUCCESS';
		$result['error_msg'] =null;
	}else{
		$result['login_status'] = 'FAILED';
        $result['error_msg'] = 'Invaid Request Method';
	}
    
    return $result;
}
function validate_login($username,$password){
	global $DB;
	$result=null;
	$sql="SELECT case when user_password='$password' then 1 else 0 end validity FROM [USER] where username='$username'";
	$stmt = sqlsrv_query($DB, $sql);
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
		$result=$row['validity'];
	}
    sqlsrv_free_stmt($stmt);
    return $result;
}
