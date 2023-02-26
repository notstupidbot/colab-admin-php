<?php
require_once(__DIR__."/BaseMdl.php");


class WordListTtfMdl extends BaseMdl{
	public $table = "word_list_ttf";

	function __construct(){
		parent::__construct();
		$this->load->model("WordListTtfMdl","m_word_list");
	}
	function create($text, $content){
        $word = $this->m_word_list->getByWord($text);

		$row = ["content" => $content, "path" => "", "word_id" => $word['id']];
        $this->db->insert($this->table, $row);
        $row["id"] = $this->db->insert_id();
        return $row;
	}

	function getByWord($text){
		// print_r(__FILE__.":".__LINE__.":".$text);

		$word = $this->m_word_list->getByWord($text);
		if(!$word){
			$word = $this->m_word_list->create($text);
		}
		return $this->db->where("word_id", $word["id"])->from($this->table)->get()->row_array();
	}
	function convert($text){
		$word_ttf = $this->getByWord($text);

		if(!$word_ttf){
			$shell_path = realpath(APPPATH . "../addon/convert-ttf.sh");
	        $shell_cmd =  "sudo bash ".$shell_path ." \"". $text . "\" ";
	  
	        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
	            $shell_cmd = $python . " ". realpath(APPPATH . "../addon/convert-ttf.py")." ". $text;
	        } 

	        $content = shell_exec($shell_cmd); 
			$word_ttf = $this->create($text, $content);
		}

		return $word_ttf['content'];
	}
}