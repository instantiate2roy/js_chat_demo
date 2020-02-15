<?php

include_once ('../DB_connection/connection.php');
include_once ('functions.php');

process_requests();

function process_requests() {
    $result;
    $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);
    switch ($method) {
        case 'GET':
            $chat_owner = get_filtered_data('chat_owner', 'GET');
			if (trim($chat_owner) != '') {
                $result = get_chat_data($chat_owner);
            } else {
                $result = get_chat_data();
            }
            break;
        case 'PUT':
            echo 'PUT';
            break;
        case 'POST':
            break;
        case 'DELETE':
            echo 'DELETE';
            break;
    }
    if ($result != null) {
        echo json_encode($result);
    }
}

function get_chat_data($chat_owner = null) {
	global $DB;
    $result = null;
	$sql="select chat_code,chat_title,chat_desc,chat_created_date, case  when chat_owner=participant_username then 'Owner' else 'Participant' end chat_ownership
				from CHAT_PARTICIPANT
				join CHAT_ROOM on participant_chatroom=chat_code
				where participant_username='$chat_owner'
		union 
			SELECT chat_code,chat_title,chat_desc,chat_created_date, 'Owner' chat_ownership 
			FROM CHAT_ROOM 
			where chat_owner='$chat_owner';";
    //$sql = "SELECT chat_code,chat_title,chat_desc,chat_created_date FROM CHAT_ROOM where chat_owner='$chat_owner'";
    if ($chat_owner = null || trim($chat_owner) == '') {
        $sql = 'SELECT chat_code,chat_title,chat_desc,chat_created_date,chat_owner FROM CHAT_ROOM';
    }
	
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
