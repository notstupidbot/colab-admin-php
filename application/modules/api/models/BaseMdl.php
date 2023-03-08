<?php

class BaseMdl extends CI_Model{
	public $table = "";
	public $pk = "id";

	function getById($id){
		$row = $this->db->where("id",$id)->from($this->table)->get()->row_array();

		return $row;
	}
	function getByPk($pk){
		return $this->getById($pk);
	}
	function getAll($limit=10){

		return $this->db->limit($limit)->get($this->table)->result_array();
	}

	function update($pk, $data){
		foreach($data as $key => $val){
			if(!empty($val)){
				$this->db->set($key, $val);
			}
		}
		return $this->db->where($this->pk, $pk)->update($this->table);
	}

	function getAllPaged($page_number, $limit, $order_by="create_date", $order_dir="asc"){
		$total_records = $this->getCount();
		$offset = ($page_number  == 1) ? 0 : ($page_number * $limit) - $limit;

		$total_pages = ceil($total_records / $limit);


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
	function getCount(){
		return $this->db->count_all($this->table);
	}
}