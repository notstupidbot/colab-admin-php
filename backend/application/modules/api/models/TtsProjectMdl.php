<?php

require_once(__DIR__."/BaseMdl.php");

class TtsProjectMdl extends BaseMdl{
	public $table = "tts_project";

	public function __construct()
	{
		parent::__construct();
		$this->load->model("SentenceMdl","m_sentence");
	}

	function create($title){
        $row= [
        	"id" => gen_uuid(),
        	"title" => $title
        ];
        $this->db->insert($this->table, $row);

        return  $this->getById($row['id']);
	}

	function add_item($pk, $item_id){
		$row = $this->getById($id);
		$items = json_decode($row['items']);

		$items[] = $item_id;

		$items = json_encode($items);

		$this->db->where($this->pk, $pk)->update($this->table, ['items'=>$items]);

		return $items;
	}

	function get_items($pk){
		$row = $this->getById($pk);
		$items = json_decode($row['items']);

		return $items;
	}

	function delete_item($pk, $item_id, $cascade=false){
		$row = $this->getById($id);
		$items = json_decode($row['items']);

		if (($key = array_search($item_id, $items)) !== false) {
		    unset($items[$key]);
		    if($cascade){
		    	$this->m_sentence->delete($item_id);
		    }
			$items = json_encode($items);
			$this->db->where($this->pk, $pk)->update($this->table, ['items'=>$items]);
		}

		
		return $items;
	}

	function delete_items($pk, $item_ids, $cascade=false){
		$row = $this->getById($id);
		$items = json_decode($row['items']);

		$items = array_diff( $items, $item_ids );

		if ($cascade) {
			foreach($item_ids as $item_id){
				$this->m_sentence->delete($item_id);
			}
		}
		$items = json_encode($items);
		$this->db->where($this->pk, $pk)->update($this->table, ['items'=>$items]);
			
		return $items;
		
	}

}