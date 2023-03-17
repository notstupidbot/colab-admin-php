#!/usr/bin/env php
<?php
$argv_ = $argv;

require_once dirname(__DIR__) . '/../cli.php';



function parse_args(){
    $argv_ = $GLOBALS['argv_'];
    $job_id = $argv_[1];
    $sentence_id = $argv_[2];
    $text   = $argv_[3];
    $speaker_id = isset($argv_[4]) ? $argv_[4] : 'SU-03712';
    $index_number = isset($argv_[5]) ? $argv_[5] : -1;

    return [$job_id, $sentence_id, $text, $speaker_id, $index_number];
}

function get_output_file($sentence_id, $index_number){
    $www_dir = realpath(APPPATH . "/../");
    $output_path = "$www_dir/public/tts-output";
    $output_url = "public/tts-output";
    $output_file = "$sentence_id.wav";
    $chunkMode = false;

    if($index_number > -1){
        $output_file = "$sentence_id-$index_number.wav";
        $chunkMode = true;
    }
    $output_url = "$output_url/$output_file";
    $output_file = $output_path . '/' . $output_file;
    return [$chunkMode, $output_file, $output_url];
}

function pre_main($ci, $url, $output_file, $proxy="socks5://127.0.0.1:1081"){
    $ci->benchmark->mark('code_start');

    $client = new \GuzzleHttp\Client();
    $options = [
        'timeout' => 60*60*60, // 1 hour
        'verify' => false,
    ];

    if(!empty($proxy)){
        $options['proxy'] = $proxy;
    }

    $response = $client->get($url, $options);

    file_put_contents($output_file,$response->getBody()->getContents());
    $ci->benchmark->mark('code_end');

    $elapsed_time = $ci->benchmark->elapsed_time('code_start', 'code_end');

    return [
        'elapsed_time' => floatval($elapsed_time),
        'output_file' => $output_file
    ];
}
function after_main($ci, $job_id, $output_file, $chunkMode, $index_number, $sentence_id, $orig_result){
    $job = $ci->m_job->getById($job_id);
    if(!empty($job)){
        $subscriber_id = $job['subscriber_id'];
        $message = "job id $job_id success";

        $data = [ 'ps_output'=> json_encode($orig_result)];
        $ci->m_job->update($job_id, $data);
        $result = [
            'at' => 'run_process',
            'job' => $job,
            'chunkMode' => $chunkMode,
            'index' => $index_number,
            'sentence_id' => $sentence_id,
            'success' => true
        ];
        $result = array_merge($orig_result, $result);
        $ci->m_zmq->send_log($subscriber_id, $message, $result);
        return $result;
    }else{
        $result = array_merge($orig_result,['warning'=>"unexistent job_id $job_id"]);
    }
        
    return  $result;
}   
function main(){
    $ci = get_instance();
    $ci->load->model('api/ZmqMdl', 'm_zmq');
    $ci->load->model('api/JobMdl', 'm_job');

    list($job_id, $sentence_id, $text, $speaker_id, $index_number) = parse_args();
    list($chunkMode, $output_file, $output_url) = get_output_file($sentence_id, $index_number);
    $tts_server_endpoint = 'http://127.0.0.1:5002';
    $url = sprintf('%s/api/tts?text=%s&speaker_id=%s&style_wav=&language_id=',
                         $tts_server_endpoint, $text, $speaker_id);

    // echo $url;
    // exit();
    $result = pre_main($ci, $url, $output_file);
    $result['url'] = $url;
    $result['output_url'] = $output_url;
    $result = after_main($ci, $job_id, $output_file, $chunkMode, $index_number, $sentence_id, $result);
    echo json_encode($result,JSON_PRETTY_PRINT);
}



main();