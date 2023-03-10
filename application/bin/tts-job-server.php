#!/container/dist/bin/php
<?php

require_once dirname(__DIR__) . '/../cli.php';

$ci = get_instance();
$ci->load->model('api/ZmqMdl', 'm_zmq');
$ci->load->model('api/JobMdl', 'm_job');

$job_id = $argv[1];
$sentence_id = $argv[2];
$text 	= $argv[3];
$speaker_id = isset($argv[4]) ? $argv[4] : 'SU-03712';
$index_number = isset($argv[5]) ? $argv[5] : -1;

$tts_dir = "/container/dist/tts-indonesia";
$www_dir = "/container/dist/www/html";
$output_path = "$www_dir/public/tts-output";
$output_file = "$sentence_id.wav";
$chunkMode = false;

if($index_number > -1){
	$output_file = "$sentence_id-$index_number.wav";
	$chunkMode = true;
}
$output_file = $output_path . '/' . $output_file;
$tts_server_endpoint = 'http://localhost:5002';

const $curl_url = sprintf('%s/api/tts?text=%s&speaker_id=%s&style_wav=&language_id=',$tts_server_endpoint, urlencode($text), $speaker_id);

$cmdline = sprintf('curl "%s" -o "%s"', $curl_url, $output_file); 
$ps_output = shell_exec("$cmdline  2>&1 ");

$job = $ci->m_job->getById($job_id);

$subscriber_id = $job['subscriber_id'];
$message = "job id $job_id success";

$data = [ 'ps_output'=> json_encode(['output_file'=>$output_file]), 'cmdline'=>$cmdline];
$ci->m_job->update($job_id, $data);
$job['cmdline'] = $cmdline;
$result = [
	'at' => 'run_process',
    'job' => $job,
    'chunkMode' => $chunkMode,
    'index' => $index_number,
    'sentence_id' => $sentence_id,
    'success' => true
];
$ci->m_zmq->send_log($subscriber_id, $message, $result);