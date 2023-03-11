<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tts extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
        $this->load->model("TtsProjectMdl","m_project");
        $this->load->model("JobMdl","m_job");
        $this->load->model("ZmqMdl","m_zmq");

        $this->load->model("PreferenceMdl","m_preference");
        $this->load->model("SentenceMdl","m_sentence");
        $this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");

    }


    function project_post() {
        $title = $this->post('title');

        if(!empty($title)){
            $project = $this->m_project->create($title);
            $this->response($project, 200);
        }
    }

    function project_get() {
        
        $id = $this->input->get("id");
        $page = $this->input->get("page");
        $limit = $this->input->get("limit");
        $order_by = $this->input->get("order_by");
        $order_dir = $this->input->get("order_dir");

        if(empty($page))
            $page =1;
        if(empty($limit))
            $limit =10;
        if(empty($order_by)){
            $order_by = "create_date";
        }
        if(empty($order_dir)){
            $order_dir = "asc";
        }
        if($id){
            $record = $this->m_project->getById($id);
            $this->response($record, 200);
        }else{
           
            $paged_list = $this->m_project->getAllPaged($page,$limit, $order_by, $order_dir);
            $this->response($paged_list, 200);
        }
 
    }
    function sentence_get() {
        
        $id = $this->input->get("id");
        $page = $this->input->get("page");
        $limit = $this->input->get("limit");
        $order_by = $this->input->get("order_by");
        $order_dir = $this->input->get("order_dir");
        $project_id = $this->input->get("project_id");
        $filter = ['fields'=>[], 'search'=>[]];
        if(empty($page))
            $page =1;
        if(empty($limit))
            $limit =10;
        if(empty($order_by)){
            $order_by = "create_date";
        }
        if(empty($order_dir)){
            $order_dir = "asc";
        }
        if(!empty($project_id)){
            $filter['fields'] = [
                'project_id' => $project_id
            ];

        }
        if($id){
            $sentence = $this->m_sentence->getById($id);
            $this->response($project, 200);
        }else{
           
            $sentences = $this->m_sentence->getAllPaged($page,$limit, $order_by, $order_dir,$filter);
            $this->response($sentences, 200);
        }
 
    }
    function sentence_post() {
        
        $id = $this->input->get("id");
        $title = $this->input->post('title');
        $content = $this->input->post('content');
        $content_ttf = $this->input->post('content_ttf');
        $sentences = $this->input->post('sentences');
        $project_id = $this->input->post('project_id');
        
        

        if($id){
            $sentence = $this->m_sentence->getById($id);
            $sentence = [
                'title' => $title,
                'content' => $content,
                'content_ttf' => $content_ttf,
                'sentences' => $sentences,
                'last_updated' => date('Y-m-d H:i:s'),

            ];
            $this->m_sentence->update($id, $sentence);
            $this->response($sentence, 200);
        }else{
            $sentence = $this->m_sentence->create($title, $content, $content_ttf, $sentences, '-',$project_id);
            $this->response($sentence, 200);
        }
 
    }

    function preference_get(){
        $key = $this->input->get('key');
        if(!empty($key)){

            $preference = $this->m_preference->getByKey($key);

            $this->response($preference, 200);
        }
    }

    function preference_post(){
        $key = $this->input->get('key');
        $val = $this->input->post('val');
        if(!empty($key)){

            if(!empty($val)){
                $current = $this->m_preference->getByKey($key);
                
                if(!empty($current)){
                   $this->m_preference->update($key,$val);
                }else{
                    $this->m_preference->create($key, $val);
                    $current = ['key'=>$key, 'val' => json_decode($val)];
                }
                $this->response($current, 200);
            }
            
        }
    }

    function convert_get(){
        $input_text = trim($this->input->get("text"));

        $input_text_split = explode(' ', $input_text);
        $output_text = [];

        foreach($input_text_split as $text){
            $text = strtolower($text);
            $text = preg_replace("/[^a-z]/", "", $text);
            if(empty($text))
                continue;
            $output_text[] = ['text'=> $text,'ttf'=>$this->m_word_list_ttf->convert($text)];
        }
        $this->response($output_text,200);
             
        

    }

    function job_post(){
        $subscriber_id = $this->input->get('subscriber_id');
        $chunkMode = $this->input->get('chunkMode');
        $index_number = $this->input->get('index');
        $speaker_id = $this->input->get('speaker_id');

        $sentence_id = $this->input->post('sentence_id');
        $text = $this->input->post('text');

        $use_server = $this->input->get('use_server');

        $script = APPPATH . 'bin/tts-job.sh';

        if($use_server){
            $script = APPPATH . 'bin/tts-job-server.sh';
            // $text = urlencode($text);
        }
        if(empty($speaker_id)){
            $speaker_id =  'SU-03712';
        }
        $pidfile = "/tmp/tts-$sentence_id-$index_number.pid";
        $job_id = gen_uuid();
        $index = is_numeric($index_number) ? $index_number : -1; 
       
        $shell_cmd = sprintf('sudo bash %s %s %s "%s" "%s" %s > /dev/null 2>&1 & echo $! > %s', 
                              $script, $job_id, $sentence_id, $text, $speaker_id, $index, $pidfile);
        shell_exec($shell_cmd);
       
        $pid = trim(file_get_contents($pidfile));
        $job = $this->m_job->create($job_id,'tts', $shell_cmd, $subscriber_id, $pid);
        
        $result = [
            'job' => $job,
            'chunkMode' => $chunkMode,
            'index' => $index,
            'sentence_id' => $sentence_id
        ];
        $this->response($result,200);

    }        

}