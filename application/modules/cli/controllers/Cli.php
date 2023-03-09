<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cli extends MX_Controller {

	public function __construct()
	{
		parent::__construct();
		
	}

	function index(){
		echo "Cli::index() -> APPPATH/modules/cli/controllers/Cli.php line:".__LINE__."\n";
	}

	function messaging(){
		$this->load->model('api/MessagingMdl', 'm_messaging');
		$this->load->model('api/ZmqMdl', 'm_zmq');

		$this->m_zmq->connect();
		$subscribers = $this->m_messaging->getAll();
		echo "List of subscribers \n"; 

		$data_to_send = ['foo' => ['bar' => 'bas'] ];
		
		foreach($subscribers as $subscriber){
			echo $subscriber['subscriber_id']." \n";
			echo "Try to send data\n";
			$subscriber_id = $subscriber['subscriber_id'];
			$this->m_zmq->send_log($subscriber_id, 'This is log message', $data_to_send);
			$this->m_zmq->send_loged_in($subscriber_id);
			
		}
	}
}