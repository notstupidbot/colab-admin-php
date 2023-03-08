<?php

require_once(__DIR__."/BaseMdl.php");

class PreferenceMdl extends BaseMdl{
	public $table = "preferences";

	public function __construct()
	{
		parent::__construct();
	}

	function getByKey($key){
		$row = $this->db->where("key='$key'")->get($this->table)->row_array();
		if(empty($row)){
			return null;
		}
		$row['val'] = json_decode($row['val']);
		return $row;
	}

	function create($key, $val){
		$row = [
			'key' => $key,
			'val' => $val
		];
		$this->db->insert($this->table,$row);
	}
	function update($key, $val){
		$row = [
			'val' => $val
		];
		$this->db->where("key='$key'")->update($this->table,$row);
	}
}