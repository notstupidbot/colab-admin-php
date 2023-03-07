<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tts extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
        $this->load->model("TtsProjectMdl","model");
        $this->load->model("SentenceMdl","m_sentence");
        $this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");

    }


    function project_post() {
        
        $text = $this->post('text');

        
        $id = $this->model->createId($text);

        $project = $this->model->getById($id);

        if(!$project){
            $project = $this->model->create($id,$text,$id);
        }


        $output = [
            "id" => $id,
            "project" => $project

        ]; 
        $this->response($output, 200);
    }

    

    function project_get() {
        
        $id = $this->get("id");
        if($id){
            $project = $this->model->getById($id);
            $this->response($project, 200);
        }else{
            $limit = 10;
            $projects = $this->model->getAll($limit);
            $this->response($projects, 200);
        }
 
    }
    function sentence_get() {
        
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
            $sentence = $this->m_sentence->getById($id);
            $this->response($project, 200);
        }else{
           
            $sentences = $this->m_sentence->getAllPaged($page,$limit, $order_by, $order_dir);
            $this->response($sentences, 200);
        }
 
    }
    function sentence_post() {
        
        $id = $this->input->get("id");
        $name = $this->input->post('name');
        $text = $this->input->post('text');
        $ttf_text = $this->input->post('ttf_text');
        $sentences = $this->input->post('sentences');
        
        

        if($id){
            $sentence = $this->m_sentence->getById($id);
            $sentence = [
                'name' => $name,
                'text' => $text,
                'ttf_text' => $ttf_text,
                'sentences' => $sentences,
                'last_updated' => date('Y-m-d H:i:s'),

            ];
            $this->m_sentence->update($id, $sentence);
            $this->response($sentence, 200);
        }else{
            $sentence = $this->m_sentence->create($name, $text, $ttf_text, $sentences, '-');
            $this->response($sentence, 200);
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

}