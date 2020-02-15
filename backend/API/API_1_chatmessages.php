<?php

include_once ('../DB_connection/connection.php');
include_once ('functions.php');

echo json_encode(process_requests());

function process_requests() {
    $result;
    $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);
    switch ($method) {
        case 'GET':
            $chat_code = get_filtered_data('chatcode', 'GET');
			if (trim($chat_code) != '') {
                $result = get_chat_data($chat_code);
            } else {
                $result = get_chat_data();
            }
            break;
        case 'PUT':
           $result='PUT';
            break;
        case 'POST':
			$postdata = file_get_contents("php://input");
			$request_data = json_decode($postdata);
			
			$chat_code = $request_data->chat_code;
			$user = $request_data->user;
			$message = $request_data->message;
			$errors=add_new_message($chat_code,$user,$message);
			if(!$errors){
				$result='successful';
			}else{
				$result='Failed to register message';
			}
			break;
        case 'DELETE':
            $result='DELETE';
            break;
    }
	return $result;
 }
function add_new_message($chat_code,$user,$message){
	$result=null;
	global $DB;
	$sql="insert into chat_message([sender_username],[chat_code],[status],message_text)VALUES ( ?,?,?,?)";
	$params = array( $user,$chat_code,'S',$message);
	
	$stmt = sqlsrv_query($DB, $sql, $params);
	if($stmt===false){
		$result= json_encode(sqlsrv_errors());
	}
	return $result;
}

function get_chat_data($chat_code = null) {
	global $DB;
    $result = null;
	$sql="select * 
			from(select top(10) X.* 
			from(select row_number() over (partition by chat_code order by message_id desc) rownum,sender_username,chat_code,status,sent_date,message_text,message_id 
			FROM chat_message   where chat_code='$chat_code') x)y
		order by  rownum desc";
    //$sql = "SELECT top(10)[sender_username],[chat_code],[status],[sent_date],message_text FROM [CHAT_MESSAGE] where chat_code='$chat_code' order by message_id desc";
    $stmt = sqlsrv_query($DB, $sql);
    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $result[] = $row;
    }
    sqlsrv_free_stmt($stmt);
    return $result;
}
