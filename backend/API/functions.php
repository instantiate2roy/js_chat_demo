<?php

function get_filtered_data($key, $filter_type) {
    $result = null;
    switch ($filter_type) {
        case 'GET':
            $result = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            break;
        case 'POST':
            $result = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            break;
        case 'POST_ARRAY':
            $result = filter_input(INPUT_POST, $key, FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
            break;
        case 'ENCODED':
            filter_input(INPUT_GET, 'search', FILTER_SANITIZE_ENCODED);
            break;
        default:
            $result = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            break;
    }
    return $result;
}

