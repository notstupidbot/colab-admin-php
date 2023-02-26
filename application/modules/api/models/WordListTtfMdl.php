<?php
require_once(__DIR__."/BaseMdl.php");


class WordListTtfMdl extends BaseMdl{
	public $table = "word_list_ttf";

	function create($content){
        
		$row = ["content" => $content, "path" => ""];
        $this->db->insert($this->table, $row);
        $row["id"] = $this->db->insert_id();
        return $row;
	}
}