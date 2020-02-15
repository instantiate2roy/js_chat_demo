<?php

function establish_DB_connection($serverName, $db, $user, $pass) {
    $connectionInfo = array("Database" => $db, "UID" => $user, "PWD" => $pass);
    $conn = sqlsrv_connect($serverName, $connectionInfo);
    if ($conn) {
        $GLOBALS['DB'] = $conn;
    } else {
        echo "Connection could not be established.<br />";
        die(print_r(sqlsrv_errors(), true));
    }
}

/*create the MSSQL DB connection by providing the appropriate;
 *  server name,DB name , username and password*/
establish_DB_connection('SERVER_NAME', 'DB_NAME', 'USER_NAME', 'PASSWORD');

