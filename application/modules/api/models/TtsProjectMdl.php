<?php

require_once(__DIR__."/BaseMdl.php");

class TtsProjectMdl extends BaseMdl{
	public $table = "tts_project";

	public function __construct()
	{
		parent::__construct();
		$this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");
	}
	function getById($id){
		$row = $this->db->where("id",$id)->from($this->table)->get()->row_array();

		if($row){
		
			$word_list = json_decode($row['word_list']);
	        $row["word_list_ttf"] = $this->process_world_list($word_list);
	        $row["word_list_ttf_str"] = implode(" ", $row["word_list_ttf"]);
		}
		return $row;
	}
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
        $row["word_list_ttf"] = $this->process_world_list($word_list);
        $row["word_list_ttf_str"] = implode(" ", $row["word_list_ttf"]);

        return $row;
	}

	function createId($text){
		return md5sum($text);
	}

	public function process_world_list($word_list)
	{
		$word_ttf_list = [];
		foreach ($word_list as $text) {
			$word_ttf = $this->m_word_list_ttf->getByWord($text);
			if(!$word_ttf){
				$word_ttf = $this->m_word_list_ttf->convert($text);

			}else{
				$word_ttf = $word_ttf['content'];
			}
			$word_ttf_list[] = trim($word_ttf);
		}

		return $word_ttf_list;
	}

}