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
$cmdline = sprintf('tts --text "%s" --model_path checkpoint.pth --config_path config.json --speaker_idx "%s" --out_path "%s"', $text, $speaker_id, $output_file); 

chdir($tts_dir);
echo $cmdline . "\n";
$ps_output = shell_exec("$cmdline  2>&1 ");



$ps_output_split = str_replace(' | > ', '', $ps_output);
$ps_output_split = str_replace(' > ', '', $ps_output_split);
$ps_output_split = explode("\n", $ps_output_split);

$ps_output = ['lines'=>[],'info'=>[]];
foreach($ps_output_split as $line){
	$line = trim($line);
	if(empty($line)){
		continue;
	}
	if(preg_match('/\:/',$line)){
		$kv = explode(':',$line);
		$k = underscore($kv[0]);
		$ps_output['info'][$k] = $kv[1];
	}else{
		if(preg_match('/Saving\ output\ to/',$line)){
			$kv = explode('Saving output to', $line);
			$ps_output['info']['output_file'] = str_replace($www_dir.'/','',trim($kv[1]));

		}else{
			$ps_output['lines'][]= $line;
		}
	}

}

$job = $ci->m_job->getById($job_id);

$subscriber_id = $job['subscriber_id'];
$message = "job id $job_id success";
$data = ['ps_output'=>$ps_output];
$result = [
	'at' => 'run_process',
    'job' => $job,
    'chunkMode' => $chunkMode,
    'index' => $index_number,
    'sentence_id' => $sentence_id
];
$ci->m_zmq->send_log($subscriber_id, $message, $data);