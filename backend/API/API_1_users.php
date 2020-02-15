<?php

include_once ('../DB_connection/connection.php');
include_once ('functions.php');
process_requests();

function process_requests() {
    $result;
    $method = htmlspecialchars($_SERVER['REQUEST_METHOD']);
    switch ($method) {
        case 'GET':
            $username = get_filtered_data('username', 'GET');
            if (trim($username) != '') {
                $result = get_user_data($username);
            } else {
                $result = get_user_data();
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

function get_user_data($username = null) {
    global $DB;
    $result = null;
    $sql = "SELECT username,user_fullname FROM [USER] where username='$username'";
    if ($username = null || trim($username) == '') {
        $sql = 'SELECT TOP (100)username,user_fullname FROM [USER]';
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
