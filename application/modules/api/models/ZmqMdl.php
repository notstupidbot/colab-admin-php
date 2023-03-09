<?php
require_once(__DIR__."/BaseMdl.php");

class ZmqMdl extends BaseMdl{
	public $table = "socket_session";
	protected $socket;
	protected $context;
	public function __construct()
	{
		parent::__construct();
	    
	}

	function connect(){
		$this->context = new ZMQContext();
		print_r($this->context);
	    $this->socket = $this->context->getSocket(ZMQ::SOCKET_PUSH);
	    $this->socket->connect('tcp://127.0.0.1:5555');
	}
	function send($obj){
	    // $socket->send(json_encode(['cat'=>'onUpdateDal','data'=>$dal]) );
		//
		$this->socket->send(json_encode($obj) );
	}

	function echo($what){
		echo $what . "\n";
	}

	function send_log($subscriber_id, $message, $data){
		if(empty($this->socket)){
			$this->connect();
		}
		$this->m_zmq->send([
			'subscriber_id' => $subscriber_id,
			'type' => 'log',
			'message' => $message,
			'data' => $data 
		]);
	}
	function send_loged_in($subscriber_id){
		if(empty($this->socket)){
			$this->connect();
		}
		$this->m_zmq->send([
			'subscriber_id' => $subscriber_id,
			'type' => 'loged_in'
		]);
	}
}