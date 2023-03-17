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

	function guzzle(){
		echo "this is guzzle\n";
		$client = new \GuzzleHttp\Client();
		// $url = 'https://api.ipify.org';
		// $resource = fopen("public/tts-output/test.txt", 'w');

		


		$url = 'http://127.0.0.1:5002/api/tts?text=%C9%AAs%CB%88tilah%20%CB%88ini%20u%CB%88mum%C9%B2a%20di%C9%A1u%CB%88nakan%20%CB%88unt%CA%8A%CA%94%20m%C9%99%CB%88rud%CA%92%CA%8A%CA%94%20%CB%88pada%20a%CA%94%CB%88sara%20a%CA%94%CB%88sara%20abu%CB%88%C9%A1ida%20tu%CB%88runan%20%CB%88brahmi%20ja%C5%8B%20di%C9%A1u%CB%88nakan%20%CB%88ol%C9%9Bh%20ma%CA%83a%CB%88rakat%20indone%CB%88sia%20pra%20k%C9%99m%C9%99rde%CB%88kaan&speaker_id=SU-07842&style_wav=&language_id=';
		$response = $client->get($url, [
		'proxy' => "socks5://127.0.0.1:1081",
		'timeout' => 60*60, // 60 second
		'verify' => false,
		]);

		var_dump($response->getBody()->getContents());
	}
}