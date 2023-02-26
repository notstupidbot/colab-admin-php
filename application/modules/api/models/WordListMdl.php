<?php
require_once(__DIR__."/BaseMdl.php");


class WordListMdl extends BaseMdl{
	public $table = "word_list";

	
	function create($content){
        

		$row = ["content"=>$content];
        $this->db->insert($this->table, $row);
        $row["id"] = $this->db->insert_id();
        
        return $row;
	}

	function getByWord($word){
		return $this->db->where("content", $word)->from($this->table)->get()->row_array();
	}
}