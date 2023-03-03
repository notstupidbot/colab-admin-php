<?php
require_once(__DIR__."/BaseMdl.php");


class WordListTtfMdl extends BaseMdl{
	public $table = "word_list_ttf";

	function __construct(){
		parent::__construct();
		$this->load->model("WordListTtfMdl","m_word_list");
	}
	function create($text, $content){
		$text = strtolower($text);
        $word = $this->m_word_list->getByWord($text);

		$row = ["id"=>gen_uuid(),"content" => $content, "path" => "", "word_id" => $word['id']];
        $this->db->insert($this->table, $row);
        return $row;
	}

	function getByWord($text){
		$text = strtolower($text);

		$word = $this->m_word_list->getByWord($text);
		if(!$word){
			$word = $this->m_word_list->create($text);
		}
		return $this->db->where("word_id", $word["id"])->from($this->table)->get()->row_array();
	}
	function convert($text){
		$text = strtolower($text);
		$word_ttf = $this->getByWord($text);
		
		if(!$word_ttf){
			
	        $content =  convert_ttf($text); 
	        if(empty($content)){
	        	return "n/a";
	        }else{
				$word_ttf = $this->create($text, trim($content));
	        }
		}

		return $word_ttf['content'];
	}
}