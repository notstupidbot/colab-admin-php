<?php

namespace Addon;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;


class Pusher implements WampServerInterface
{
	/**
	 * Sebuah pencarian dari semua topik yang telah di subscribe oleh klien
 	 */
	protected $subscribedTopics = [];

	public function onSubscribe(ConnectionInterface $conn, $topic)
	{
		$this->subscribedTopics[$topic->getId()] = $topic;
	}
	/**
	* @param string JSON'ified string yang kita dapat dari ZeoMQ
	*/
	public function onRealtimeUpdate($entry)
	{
		

		$entryData = json_decode($entry,true);
		print_r($entryData);
		// Jika pencaian objek topik tidak di set , maka tidak ada yang perlu dipublis
		if(!array_key_exists($entryData['cat'], $this->subscribedTopics)){
			return;
		}

		$topic = $this->subscribedTopics[$entryData['cat']];
		// kirim kembali data ke semua klien yang udah subscribe pada kategory tsb
		$topic->broadcast($entryData);
	}
	public function onUnSubscribe(ConnectionInterface $conn, $topic)
	{
		echo('koneksi '. $conn->resourceId);
		// print_r($topic);
	}
	public function onOpen(ConnectionInterface $conn)
	{
		echo('koneksi '. $conn->resourceId);
	}
	public function onClose(ConnectionInterface $conn)
	{
		# code...
	}
	public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
	{
		// Di app ini jika klien mengirim data dikarenakan hacking melalui console
		$conn->callError($id, $topic, 'Anda tidak diperbolehkan membuat panggilan')->close();
	}
	public function onPublish(ConnectionInterface $conn, $topic, $event,  array $exclude, array $eligible)
	{
		// Di app ini jika klien mengirim data dikarenakan hacking melalui console
		$conn->close();
	
	}
	public function onError(ConnectionInterface $conn, \Exception $e)
	{
		# code...
	}	
}