<?php

require_once(__DIR__."/BaseMdl.php");

class TtsProjectMdl extends BaseMdl{
	public $table = "tts_project";

	function create($id,$text,$name){
		$word_list = explode(" ",$text);
		if(!$name){
			$name = $id;
		}
        $row= [
        	"id" => $id,
        	"word_list" => json_encode($word_list),
         	"text" => $text,
        	"word_count" => count($word_list),
        	"output_file" => "",
        	"name" => $name
        ];

        $this->db->insert($this->table, $row);

        return $row;
	}

	function createId($text){
		$output_file =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));

        file_put_contents($output_file, $text);

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $md5sum = shell_exec("md5sum -u ".$output_file);
        } else {
            $md5sum = shell_exec("md5sum ".$output_file);
            
        }
        $md5sum = explode(' ', $md5sum);

        return $md5sum[0];
	}

}