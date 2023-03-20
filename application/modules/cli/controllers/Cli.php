<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cli extends MX_Controller {

	public function __construct()
	{
		parent::__construct();
		
	}

	function index(){
		// echo "Cli::index() -> APPPATH/modules/cli/controllers/Cli.php line:".__LINE__."\n";
	}
	function convert(){
		echo convert_ttf_server('halo bandung');
	}
	function messaging(){
		$this->load->model('api/PreferenceMdl', 'm_preference');
		$this->load->model('api/MessagingMdl', 'm_messaging');
		$this->load->model('api/ZmqMdl', 'm_zmq');
		$this->load->model('api/SentenceMdl', 'm_sentence');

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
		$this->benchmark->mark('code_start');

		echo "this is guzzle\n";
		$client = new \GuzzleHttp\Client();
		// $url = 'https://api.ipify.org';
		// $resource = fopen("public/tts-output/test.txt", 'w');

		


		$url = 'http://127.0.0.1:5002/api/tts?text=a%CA%94%CB%88sara%20nusan%CB%88tara%20m%C9%99ru%CB%88pakan%20%CB%88ra%C9%A1am%20a%CA%94%CB%88sara%20a%CB%88tau%20tu%CB%88lisan%20tradisi%CB%88onal%20ja%C5%8B%20di%C9%A1u%CB%88nakan%20di%20wi%CB%88lajah%20nusan%CB%88tara&speaker_id=SU-08703&style_wav=&language_id=';
		$response = $client->get($url, [
		'proxy' => "socks5://127.0.0.1:1081",
		'timeout' => 60*60*60, // 1 hour
		'verify' => false,
		]);

		file_put_contents("public/tts-output/test.wav",$response->getBody()->getContents());
		$this->benchmark->mark('code_end');

		echo $this->benchmark->elapsed_time('code_start', 'code_end');
	}

	function fix_slug(){
		// $projects = $this->db->get('tts_project')->result_array();

		// foreach($projects as $project){
		// 	echo $project['id'] . slug($project['title']). "\n";
		// 	$this->db->where('id', $project['id'])->update('tts_project',['slug'=>slug($project['title'])]);
		// }

		$sentences = $this->db->get('tts_sentence')->result_array();

		foreach($sentences as $sentence){
			echo $sentence['id'] . slug($sentence['title']). "\n";
			$this->db->where('id', $sentence['id'])->update('tts_sentence',['slug'=>slug($sentence['title'])]);
		}
	}

	function fix_order(){
		$projects = $this->db->order_by('create_date','asc')->get('tts_project')->result_array();

		foreach($projects as $index => $project){
			echo $project['id'] . slug($project['title']). "\n";
			$this->db->where('id', $project['id'])->update('tts_project',['order'=>$index]);

			$sentences = $this->db->where('project_id', $project['id'])->order_by('create_date','asc')->get('tts_sentence')->result_array();

			foreach($sentences as $index_s => $sentence){
				echo $sentence['id'] . slug($sentence['title']). "\n";
				$this->db->where('id', $sentence['id'])->update('tts_sentence',['order'=>$index_s]);
			}
		}

	}

	function set_order(){
		$this->load->model('api/SentenceMdl', 'm_sentence');

		$sentence = $this->m_sentence->getById('d043b5008ba0486fbac1bde347f7933e');
		// print_r($sentence);
		$this->m_sentence->set_order($sentence['id'],$sentence['project_id']);


	}

}