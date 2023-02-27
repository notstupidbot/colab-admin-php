<?php

class BaseMdl extends CI_Model{
	public $table = "";
	function getById($id){
		$row = $this->db->where("id",$id)->from($this->table)->get()->row();

		return $row;
	}
	function getAll($limit=10){

		return $this->db->limit($limit)->get($this->table)->result_array();
	}
}