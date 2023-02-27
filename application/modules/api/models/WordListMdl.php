<?php
require_once(__DIR__."/BaseMdl.php");


class WordListMdl extends BaseMdl{
	public $table = "word_list";

	function create($content){
        
		$content = strtolower($content);
		$row = [
			"id" => gen_uuid(),
			"content" => $content
		];
        $this->db->insert($this->table, $row);
        
        return $row;
	}

	function getByWord($word){
		$word = strtolower($word);
		return $this->db->where("content", $word)->from($this->table)->get()->row_array();
	}
}