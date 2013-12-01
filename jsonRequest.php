<?php
    /*
    echo $_GET['callback'];
    echo file_get_contents ('books.json');
    */
    sleep(1);
    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

    $callback = $_GET['callback'];
    echo $callback.'('.file_get_contents ('notValid.json').');';
?>