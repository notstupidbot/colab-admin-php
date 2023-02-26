<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tts extends REST_Controller {

    function __construct($config = 'rest') {
        parent::__construct($config);
        $this->load->database();
    }

    function index_post() {
        $text = $this->post('text');
        $word_list = explode(" ",$text);
        
        $output_file =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));

        file_put_contents($output_file, $text);

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $md5sum = shell_exec("md5sum -u ".$output_file);
        } else {
            $md5sum = shell_exec("md5sum ".$output_file);
            
        }
        $md5sum = explode(' ', $md5sum);

        $output = [
            "id" => $md5sum[0],
            "text" => $text,
            "word_count" => count($word_list),
            "word_list" => $word_list,
            "output_path" => "",
            
        ];
        if ($text){
            
        }
        $this->response($output, 200);
    }

    function word_list_get() {
        // $text = $this->post('text');

        $results = [
            // "output_path" => "",
            // "id" => "",
            // "word_count" => 0,
            // "text" => $text
        ];
       
        $this->response($results, 200);
    }
    //http://localhost/api/tts/md5sum
    function md5sum_post() {
        error_reporting(E_ALL);
        $text = $this->post('text');
        $output_file =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));

        file_put_contents($output_file, $text);

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $md5sum = shell_exec("md5sum -u ".$output_file);
        } else {
            $md5sum = shell_exec("md5sum ".$output_file);
            
        }
        $md5sum = explode(' ', $md5sum);
        $results = [
            "output_file" => $output_file,
            "md5sum" => $md5sum[0]
        ];
       // print_r($results);
        $this->response($results, 200);
    }    

}