<?php
require_once(__DIR__."/BaseMdl.php");

class MessagingMdl extends BaseMdl{
	public $table = "messaging";
	protected $socket;
	public function __construct()
	{
		parent::__construct();
	    
	}

	function create($subscriber_id){
		$this->db->insert($this->table,['subscriber_id'=>$subscriber_id]);
	}

	function getBySubscriberId($subscriber_id){
		return $this->db->where('subscriber_id', $subscriber_id)->get($this->table)->row_array();
	}

	function update($subscriber_id, $row){
		foreach($row as $key => $val){
			if(empty($val)){
				$val="-";
			}
			if(!empty($val)){
				$this->db->set($key, $val);
			}
		}
		return $this->db->where('subscriber_id', $subscriber_id)->update($this->table);
	}
}