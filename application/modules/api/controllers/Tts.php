<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tts extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
        $this->load->model("TtsProjectMdl","model");
        $this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");

    }

    function index_post() {
        
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
        $project = $this->model->getById($id);

        $this->response($project, 200);
    }

    function convertTtf_get(){
        $text = $this->get("text");

        $this->response([
            "text" => $text,
            "output_text" => $this->m_word_list_ttf->convert($text)
        ]);
             
        

    }        

}