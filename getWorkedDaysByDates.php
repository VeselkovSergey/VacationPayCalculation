<?php

try {
//    echo '<pre>';
    $date1 = $_GET['date1'];
    $date2 = $_GET['date2'];

    $res = file_get_contents("https://isdayoff.ru/api/getdata?date1=$date1&date2=$date2&delimeter=,");

    $array = explode(',', $res);

    $time1String = "$date1[0]$date1[1]$date1[2]$date1[3]-$date1[4]$date1[5]-$date1[6]$date1[7]";
    $time2String = "$date2[0]$date2[1]$date2[2]$date2[3]-$date2[4]$date2[5]-$date2[6]$date2[7]";

    $time11String = "$date1[6]$date1[7]-$date1[4]$date1[5]-$date1[0]$date1[1]$date1[2]$date1[3]";
    $time22String = "$date2[6]$date2[7]-$date2[4]$date2[5]-$date2[0]$date2[1]$date2[2]$date2[3]";
    $date11 = new DateTime($time11String);
    $date22 = new DateTime($time22String);
    $interval = $date22->diff($date11);
    $daysInterval = $interval->days;

//    print_r($date11);
//    print_r($date22);
//    print_r($interval);

    $iterationDate = $time1String;
    $workedDaysByDate = [];
    for ($i = 0; $i <= $daysInterval; $i++) {
        $iterationDate = date('d.m.Y', strtotime($iterationDate. ''));
        //echo $iterationDate . PHP_EOL;
        $workedDaysByDate[$iterationDate] = !$array[$i];
        $iterationDate = date('d.m.Y', strtotime($iterationDate. ' + 1 days'));
    }
//    echo date('Y-m-d', strtotime($time1String));
//    echo date('Y-m-d', strtotime($time1String. ' + 40 days'));
//    print_r($workedDaysByDate);

//    echo '</pre>';
    echo json_encode($workedDaysByDate);
} catch (Exception $e) {
    echo null;
}