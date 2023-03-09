<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . './cli.php';



// $ci->m_zmq->echo("Hello m_zmq");

$loop 	= React\EventLoop\Factory::create();
$pusher = new Addon\Pusher;
$pusher2 = new Addon\Pusher;

// Liste untuk web server untuk membuat ZeroMQ push setelah ajax request
$context = new React\ZMQ\Context($loop);
$pull = $context->getSocket(ZMQ::SOCKET_PULL);
// Bind ke ip 127.0.0.1 maksudnya hanya klien yang bisa terhubung dengan sendirinya
$pull->bind('tcp://127.0.0.1:5555'); 
$pull->on('message',[$pusher, 'onRealtimeUpdate']);
// $pull->on('message',[$pusher, 'onRegisterSubscriber']);

// setup WebSocket server buat klien yang ingin update realtime
// Bind ke ip 0.0.0.0 maksudnya all ip remote agar bisa konek
$webSock = new React\Socket\Server('0.0.0.0:7001',$loop); 
$webServer = new Ratchet\Server\IoServer(
	new Ratchet\Http\HttpServer(
		new Ratchet\WebSocket\WsServer(
			new Ratchet\Wamp\WampServer(
				$pusher
			)
		)
	),
	$webSock
);

$loop->run();