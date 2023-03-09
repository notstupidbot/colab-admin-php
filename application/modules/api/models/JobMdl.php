<?php

require_once(__DIR__."/BaseMdl.php");

class JobMdl extends BaseMdl{
	public $table = "jobs";

	public function __construct()
	{
		parent::__construct();
	}

	function create($id, $name, $cmdline, $subscriber_id, $pid){
		$row = [
			'id' => $id,
			'name' => $name,
			'cmdline' => $cmdline,
			'subscriber_id' => $subscriber_id,
			'pid' => $pid,
			'ps_output' => '[]',
			'create_date' => date('Y-m-d H:i:s'),
			'last_updated' => date('Y-m-d H:i:s'),
			'user_id' => NULL
		];
		$this->db->insert($this->table,$row);
		return $row;
	}
	function update($id, $row){
		$this->db->where('id',$id)->update($this->table,$row);
	}
}