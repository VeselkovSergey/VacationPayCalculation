<?php

try {
    $date = $_GET['date'];

    $res = file_get_contents("https://isdayoff.ru/$date");

    echo !(int)$res;
} catch (Exception $e) {
    echo 0;
}