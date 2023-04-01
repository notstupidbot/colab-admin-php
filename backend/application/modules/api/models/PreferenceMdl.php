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
	function getByGroup($group, $key=null, $return_val=false){
		if(!empty($key)){
			$this->db->where("group='$group'");
			$row = $this->getByKey($key);
			if(!empty($row)){
				if($return_val){
					return $row['val'];
				}
			}
			return $row;
		}
		$results = $this->db->where("group='$group'")->get($this->table)->result_array();
		if(empty($results)){
			return null;
		}

		foreach($results as $index => $row){
			$row['val'] = json_decode($row['val']);
		}
		
		return $results;
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
			'order_dir' => $order_dir,
			'limit' => $limit
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

		return $count;
	}

	function getTtsServerPrefs(){
		$tts_server_endpoint = $this->getByGroup('tts_server', 'tts_server.endpoint', true);
	    $tts_server_proxy = $this->getByGroup('tts_server', 'tts_server.proxy', true);
	    $tts_enable_proxy = $this->getByGroup('tts_server', 'tts_server.enable_proxy', true);

	    if(is_object($tts_server_endpoint)){
	        $tts_server_endpoint = !empty($tts_server_endpoint->url) ? $tts_server_endpoint->url : "";
	    }

	    if(is_object($tts_server_proxy)){
	        $tts_server_proxy = !empty($tts_server_proxy->url) ? $tts_server_proxy->url : "";
	    }
	    if(is_object($tts_enable_proxy)){
	        $tts_enable_proxy = !empty($tts_enable_proxy->value) ? $tts_enable_proxy->value : false;
	    }

	    if(!$tts_enable_proxy){
	    	$tts_server_proxy = "";
	    }

	    return [$tts_server_endpoint, $tts_server_proxy, $tts_enable_proxy];
	}
}