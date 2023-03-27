<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Dummy extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
        $this->load->model("TtsProjectMdl","model");
        $this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");

    }
    function project_post(){
        $projects = $this->model->getAll(1);
        $id = $projects[0]['id'];
        $project = $this->model->getById($id);

        $output = [
            "id" => $id,
            "project" => $project

        ]; 
        $this->response($output, 200);
    }
}