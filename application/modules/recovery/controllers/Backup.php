<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Backup extends MX_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function index()
	{
		echo "Backup database\n";

		$tables = $this->db->list_tables();
		$backup_dir = APPPATH . '../db';

		foreach($tables as $table){
			dump_table($table, $backup_dir);
		}
		
	}

}