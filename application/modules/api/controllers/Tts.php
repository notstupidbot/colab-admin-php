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
        
        $id = $this->get("id");
       

        if($id){
            $sentence = $this->m_sentence->getById($id);
            $this->response($project, 200);
        }else{
            $page = $this->get("page"); 
            $limit = 10;
            $sentences = $this->m_sentence->getAll($limit);
            $this->response($sentences, 200);
        }
 
    }
    function sentence_post() {
        
        $id = $this->input->get("id");
        // echo 'Hello'.$id;
        if($id){
            $sentence = $this->m_sentence->getById($id);
            $name = $this->input->post('name');
            $text = $this->input->post('text');
            $ttf_text = $this->input->post('ttf_text');
            $sentences = $this->input->post('sentences');

            $sentence = [
                'name' => $name,
                'text' => $text,
                'ttf_text' => $ttf_text,
                'sentences' => $sentences
            ];

            $this->m_sentence->update($id, $sentence);

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