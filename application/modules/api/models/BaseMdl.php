<?php

class BaseMdl extends CI_Model{
	public $table = "";
	function getById($id){
		$row = $this->db->where("id",$id)->from($this->table)->get()->row();

		return $row;
	}

}