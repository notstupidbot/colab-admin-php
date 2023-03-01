<?php

require_once(__DIR__."/BaseMdl.php");

class SentenceMdl extends BaseMdl{
	public $table = "tts_sentence";

	public function __construct()
	{
		parent::__construct();
		$this->load->model("WordListMdl","m_word_list");
        $this->load->model("WordListTtfMdl","m_word_list_ttf");
	}
	function getById($id){

	}
	// function getAll($limit){

	// }
	function getAllPaged($page, $limit){

	}
}