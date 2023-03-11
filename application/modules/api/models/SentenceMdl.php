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

	function create($title, $content, $content_ttf, $sentences, $output_file, $project_id){
		$sentence = [
			'id' => gen_uuid(),
            'title' => $title,
            'content' => $content,
            'content_ttf' => $content_ttf,
            'sentences' => $sentences,
            'output_file'=>'-',
            'project_id'=>$project_id,
            'last_updated' => date('Y-m-d H:i:s'),
            'create_date' => date('Y-m-d H:i:s'),
        ];
        $this->db->insert($this->table, $sentence);
        return $sentence;
	} 
	function getAllPaged($page_number, $limit, $order_by="create_date", $order_dir="asc",$filter=[]){
		$total_records = $this->getCount($filter);
		$offset = ($page_number  == 1) ? 0 : ($page_number * $limit) - $limit;

		$total_pages = ceil($total_records / $limit);

		if(!empty($filter)){
			if(!empty($filter['fields'])){
				foreach($filter['fields'] as $field => $value){
					$this->db->where($field, $value);
				}
			}
		}
		$records = $this->db->order_by($order_by,$order_dir)->offset($offset)->limit($limit)->get($this->table)->result_array();

		return [
			'records' => $records,
			'page' => $page_number,
			'total_records' => $total_records,
			'total_pages' => $total_pages,
			'order_by' => $order_by,
			'order_dir' => $order_dir
		];
	}
	function getCount($filter=[]){
		if(!empty($filter)){
			if(!empty($filter['fields'])){
				foreach($filter['fields'] as $field => $value){
					$this->db->where("$field='$value'");
				}
			}
		}
		// print_r($filter);
		$count =  $this->db->count_all_results($this->table);
		// print_r($count);
		// print_r($this->db->last_query());
		return $count;
	}
}