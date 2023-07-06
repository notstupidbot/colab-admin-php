<?php

// require 'vendor/autoload.php'; // Make sure GuzzleHTTP is installed via Composer
require_once dirname(__DIR__) . '/../cli.php';


use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Handler\CurlHandler;
use GuzzleHttp\Subscriber\Proxy;

$client = new \GuzzleHttp\Client();
$url = 'https://api.ipify.org';

$response = $client->get($url, [
'proxy' => "socks5://127.0.0.1:1081",
'timeout' => 60, // 60 second
'verify' => false
]);

var_dump($response->getBody()->getContents());