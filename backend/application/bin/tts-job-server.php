#!/usr/bin/env php
<?php
require_once dirname(__DIR__) . '/../cli.php';

function get_output_file($sentence_id, $index_number){
    $www_dir = realpath(APPPATH . "/../../www-dist");
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

function fetch_tts_server(&$ci, &$job, $url, $output_file, $proxy="", &$errors, &$warnings,$chunkMode, $index_number, $sentence_id){
    $ci->benchmark->mark('code_start');
    $client = new \GuzzleHttp\Client();
    $options = [
        'timeout' => 60*60*60, // 1 hour
        'verify' => false,
    ];

    if(!empty($proxy)){
        // echo "using proxy ${proxy}\n";
        $options['proxy'] = $proxy;
    }
    
    // zmq_log($ci, $job_id, 'gz_on_request', null);
    if(!empty($job)){
        $job_id = $job['id'];
        zmq_log($ci, $job, "init_process", "job ${job_id} running", [], 
            $chunkMode, $index_number, $sentence_id, true);
    }
    $response = "";
    // $url = "https://api.ipify.org";
    // echo $url;
    try {
        $response = $client->get($url, $options);

        // echo "Here" . "\n";

    } catch (Exception $e) {
        $errors[] = 'curl_error_code_'.$e->getCode();
        // echo "Here2" . "\n";

    }
    $ci->benchmark->mark('code_end');
    
    if(!empty($response)){
        file_put_contents($output_file,$response->getBody()->getContents());

        $elapsed_time = $ci->benchmark->elapsed_time('code_start', 'code_end');

        return [
            'elapsed_time' => floatval($elapsed_time),
            'output_file' => basename($output_file)
        ];
    }
    return false;
    
}
function zmq_log_success(&$ci, &$job, $output_file, $chunkMode, $index_number, $sentence_id, $orig_result, &$errors, &$warnings){
    // $job = $ci->m_job->getById($job_id);
    if(!empty($job)){
        $subscriber_id = $job['subscriber_id'];
        $job_id = $job['id'];
        
        $message = "job id $job_id success";
        $data = [ 'ps_output'=> json_encode($orig_result)];
        $ci->m_job->update($job_id, $data);
        unset($job['params']);
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
        $warnings[] = "unexistent job_id $job_id";
    }
        
    return  $result;
}   

function zmq_log(&$ci, $job, $at, $message, $data=[], $chunkMode="", $index="", $sentence_id="", $success=false){
    // $job = $ci->m_job->getById($job_id);
    // print_r($job);
    if(!empty($job)){
        $subscriber_id = $job['subscriber_id'];
       
        unset($job['params']);

        $result = [
            'at' => $at,
            'job' => $job,
            'chunkMode' => $chunkMode,
            'index' => $index,
            'sentence_id' => $sentence_id,
            'success' => $success,
            'elapsed_time' => 0
        ];

        if(!$success){
            $result['errors'] = $data;
        }

        $ci->m_zmq->send_log($subscriber_id, $message, $result);
    }
}

function entry_point(&$ci, &$job, $text, $speaker_id, $chunkMode, $index_number, $sentence_id, &$errors, &$warnings,$tts_server_endpoint, $tts_server_proxy, $tts_enable_proxy){
    if(empty($job)){
        $errors[] = "Empty job records";
        return false;
    }
    // $job_id = $argvArr['job_id'];
    // $sentence_id = $argvArr['sentence_id'];
    // $text = $argvArr['text'];
    // $speaker_id = $argvArr['speaker_id'];
    // $index_number = $argvArr['index'];
    // $chunkMode = $argvArr['chunkMode'];

    

    
    if(empty($tts_server_endpoint)){
        $errors[] = 'tts_server_endpoint not configured';
        return false;
    }

    $url = sprintf('%s/api/tts?text=%s&speaker_id=%s&style_wav=&language_id=',
                         $tts_server_endpoint, $text, $speaker_id);
    list($chunkMode, $output_file, $output_url) = get_output_file($sentence_id, $index_number);

    $result = fetch_tts_server($ci, $job, $url, $output_file, $tts_server_proxy, $errors, $warnings,$chunkMode, $index_number, $sentence_id);

    if(is_array($result)){
        $result['url'] = $url;
        $result['output_url'] = $output_url;
        $result['tts_server_endpoint']=$tts_server_endpoint;
        $result['tts_server_proxy'] = $tts_server_proxy;

        $result = zmq_log_success($ci, $job, $output_file, $chunkMode, $index_number, $sentence_id, $result, $errors, $warnings);
        // echo json_encode($result,JSON_PRETTY_PRINT);
    }
    return $result;
}   

$errors = [];
$warnings = [];
$result = false;
$job=null;$job_id=0; $sentence_id=0; $text=""; $speaker_id="wibowo"; $index_number=-1; $chunkMode=false;

$ci = get_instance();
$ci->load->model('api/ZmqMdl', 'm_zmq');
$ci->load->model('api/JobMdl', 'm_job');
$ci->load->model('api/PreferenceMdl', 'm_pref');
$prefs = $ci->m_pref->getTtsServerPrefs();
// print_r($prefs);
list($tts_server_endpoint, $tts_server_proxy, $tts_enable_proxy) = $prefs;
if(isset($argv[1])){
    
    $job_id = $argv[1];

    $job = $ci->m_job->getById($job_id);

    $argvArr = json_decode($job['params'],true);
    
    // $job_id = $argvArr['job_id'];
    $sentence_id = $argvArr['sentence_id'];
    $text = $argvArr['text'];
    $speaker_id = $argvArr['speaker_id'];
    $index_number = $argvArr['index'];
    $chunkMode = $argvArr['chunkMode'];
    
    // echo sprintf('%s %s %s %s %s', $sentence_id, $text, $speaker_id, $index_number, $chunkMode);

    $result = entry_point($ci, $job, $text, $speaker_id, $chunkMode, $index_number,$sentence_id, $errors, $warnings,$tts_server_endpoint, $tts_server_proxy, $tts_enable_proxy);

}else{
    $errors[] =  'Invalid arguments';
}


if(count($errors) > 0 ){
    // sleep(5);
    foreach($errors as $k => $v){
        if($v == 'curl_error_code_0'){
            $errors[$k] = "${tts_server_endpoint} is not accessible, ";
            if($tts_enable_proxy){
                $errors[$k] .= " with proxy ${tts_server_proxy}";
            }

            $errors[$k] .= " please make sure TTS Server is running, or you can change in the Preferences --> Tts Server";
        }
    }
    if(!empty($job))
        zmq_log($ci, $job, "run_process", "job ${job_id} fails", $errors, $chunkMode, $index_number, $sentence_id, false);
    echo json_encode(['errors' => $errors, 'success' => false],JSON_PRETTY_PRINT);
    exit(1);
}

echo json_encode(['errors' => $errors,'warnings' => $warnings, 'success' => true, 'result' => $result],JSON_PRETTY_PRINT);
exit(0);
