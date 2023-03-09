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
	protected $ci = NULL;

	function __construct(){
		$this->ci = get_instance();
		$this->ci->load->model('api/ZmqMdl', 'm_zmq');
		$this->ci->load->model('api/MessagingMdl', 'm_messaging');
	}
	public function onSubscribe(ConnectionInterface $conn, $topic)
	{
		// echo('Pusher::onSubscribe() '. $conn->resourceId."\n");
		// echo $topic ."\n";

		$subscriber_id = $topic;
		$existing_row = $this->ci->m_messaging->getBySubscriberId($subscriber_id);
		if(empty($existing_row)){
			$this->ci->m_messaging->create($subscriber_id);
		}else{
			$this->ci->m_messaging->update($subscriber_id,['last_updated' => date('Y-m-d H:i:s')]);
		}
		
		$this->subscribedTopics[$topic->getId()] = $topic;

		// sleep(2);
		// print_r( (string)$subscriber_id );
		$this->ci->m_zmq->send_loged_in((string)$subscriber_id);
	}

 
	/**
	* @param string JSON'ified string yang kita dapat dari ZeoMQ
	*/
	public function onRealtimeUpdate($entry)
	{
		

		$entryData = json_decode($entry,true);
		echo __FILE__ . " " . __LINE__ ."\n";
		print_r($entryData);
		// Jika pencaian objek topik tidak di set , maka tidak ada yang perlu dipublis
		if(!array_key_exists($entryData['subscriber_id'], $this->subscribedTopics)){
			return;
		}

		$topic = $this->subscribedTopics[$entryData['subscriber_id']];
		// kirim kembali data ke semua klien yang udah subscribe pada kategory tsb
		$topic->broadcast($entryData);
	}
	public function onUnSubscribe(ConnectionInterface $conn, $topic)
	{
		echo('Pusher::onUnSubscribe() '. $conn->resourceId ."\n");
		print_r($topic);
	}
	public function onOpen(ConnectionInterface $conn)
	{
		// print_r(get_class_methods($conn));
		echo('Pusher::onOpen() '. $conn->resourceId."\n");
	}
	public function onClose(ConnectionInterface $conn)
	{
		echo('Pusher::onClose() '. $conn->resourceId."\n");
		
	}
	public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
	{
		echo('Pusher::onCall() '. $conn->resourceId."\n");

		// Di app ini jika klien mengirim data dikarenakan hacking melalui console
		$conn->callError($id, $topic, 'Anda tidak diperbolehkan membuat panggilan')->close();
	}
	public function onPublish(ConnectionInterface $conn, $topic, $event,  array $exclude, array $eligible)
	{
		echo('Pusher::onPublish() '. $conn->resourceId);

		// Di app ini jika klien mengirim data dikarenakan hacking melalui console
		$conn->close();
	
	}
	public function onError(ConnectionInterface $conn, \Exception $e)
	{
		echo('Pusher::onError() '. $conn->resourceId);
	}	
}