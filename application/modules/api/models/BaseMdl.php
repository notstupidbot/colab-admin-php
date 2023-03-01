<?php

class BaseMdl extends CI_Model{
	public $table = "";
	public $pk = "id";

	function getById($id){
		$row = $this->db->where("id",$id)->from($this->table)->get()->row();

		return $row;
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
}