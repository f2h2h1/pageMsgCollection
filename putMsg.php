<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('P3P: CP="CAO PSA OUR"');

$method = $_SERVER['REQUEST_METHOD'];
if (!($method === 'GET' || $method === 'POST')) {
    exit(0);
}

$describe = 'jsErrorInfo';
$raw = file_get_contents('php://input');
$rawArr = json_decode($raw, true);
if ($rawArr !== null) {
    $raw = $rawArr;
}
$data = array(
    '_GET' => $_GET,
    '_POST' => $_POST,
    'raw' => $raw
);
$path = 'pageMsg.log';
$file = fopen($path, "a");
if (!$file) {
    return;
}
$br = "\r\n";
$txt = "[time]".date('H:i:s').$br;
$txt .= "[describe]".$describe.$br;
if (!empty($_SERVER['REMOTE_ADDR'])) {
    $txt .= "[ip]".$_SERVER['REMOTE_ADDR'].$br;
}
if (!empty($_SERVER['REQUEST_URI'])) {
    $txt .= "[request_uri]".$_SERVER['REQUEST_URI'].$br;
}
if (!empty($data)) {
    $txt .= "[data]".$br;
    $txt .= sprintf("%s", var_export($data, TRUE)).$br;
}
$txt .= $br;
fwrite($file, $txt);
fclose($file);
