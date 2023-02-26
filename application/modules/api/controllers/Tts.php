<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tts extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
        $this->load->model("TtsProjectMdl","model");

    }

    function index_post() {
        
        $text = $this->post('text');

        
        $id = $this->model->createId($text);

        $project = $this->model->getById($id);

        if(!$project){
            $project = $this->model->create($id,$text);
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
        $python = "python";

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // $md5sum = shell_exec("md5sum -u ".$output_file);
        } else {
            $python = "python3";
        }
        if($text){
            $shell_cmd = $python . " ". realpath(APPPATH . "../addon/convert-ttf.py")." ". $text;
            $output_text = shell_exec($shell_cmd);
            $this->response(["output_text" => $output_text])    ;
        }        
        


    }        

}