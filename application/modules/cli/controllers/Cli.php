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
		$this->load->model('api/PreferenceMdl', 'm_preference');
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

	function job(){
		$script = APPPATH . 'bin/tts-job.php';
		$job_id = 'job_id_1';
		$text = 'halo';
		$speaker_id = 'wibowo';
		$pidfile = "/tmp/tts-job.pid";
		$index = -1;
		// putenv("SHELL=/bin/bash");
		$shell_cmd = sprintf('%s %s %s %s %s > /dev/null 2>&1 & echo $! > %s', $script, $job_id, $text, $speaker_id, $index, $pidfile);
		echo shell_exec($shell_cmd) . "\n";
		// sleep(1);
		$pid = trim(file_get_contents($pidfile));

		echo $pid . "\n";

	}
}