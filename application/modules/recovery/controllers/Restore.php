<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Restore extends MX_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->dbforge();
	}
	public function index()
	{
		echo "Restoring database\n";
		
		$this->tts_project();
		$this->tts_sentence();

		$this->word_list();
		$this->word_list_ttf();
		$this->socket_session();
		$this->jobs();


		$this->load_db_dump();
	}
	function tts_sentence(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'name' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'text' => array(
                'type' =>'TEXT',
                'default' => '',
	        ),
	        'sentences' => array(
                'type' =>'JSON'
	        ),
	        'ttf_text' => array(
                'type' =>'TEXT',
                'default' => '',
	        ),
	        'output_file' => array(
                'type' => 'VARCHAR',
                'constraint' => '225',
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		
		$table = 'tts_sentence';
		init_db_table($fields, $table);

	}
	function tts_project(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'name' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'text' => array(
                'type' =>'TEXT',
                'default' => '',
	        ),
	        'word_list' => array(
                'type' =>'JSON',
	        ),
	        'word_count' => array(
                'type' => 'INT'
	        ),
	        'output_file' => array(
                'type' => 'VARCHAR',
                'constraint' => '225',
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		
		$table = 'tts_project';
		init_db_table($fields, $table);

	}
	function word_list(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'content' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		
		$table = 'word_list';
		init_db_table($fields, $table);

	}
	function word_list_ttf(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'content' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'word_id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
	        ),
	        'path' => array(
                'type' => 'VARCHAR',
                'constraint' => '225',
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		$table = 'word_list_ttf';
		init_db_table($fields, $table);

	}

	function load_db_dump()
	{
		echo "Loading db tables dump\n";
		$backup_dir = APPPATH . '../db';

		load_db_dump($backup_dir);
	}

	function socket_session(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'ip_addr' => array(
                'type' => 'VARCHAR',
                'constraint' => '50',
	        ),
	        'uuid' => array(
                'type' => 'VARCHAR',
                'constraint' => '50',
	        ),
	        'connected' => array(
                'type' => 'INT',
                'constraint' => '1',
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		$table = 'socket_session';
		init_db_table($fields, $table);
	}

	function jobs(){
		$fields = array(
	       'id' => array(
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => TRUE,
	        ),
	        'job_name' => array(
                'type' => 'VARCHAR',
                'constraint' => '50',
	        ),
	        'cmdline' => array(
                'type' => 'TEXT',
	        ),
	        'params' => array(
                'type' => 'JSON',
	        ),
	        'status' => array(
                'type' => 'INT',
                'constraint' => '1',
	        ),
	        'create_date' => [
	        	'type' => 'DATETIME'
	        ]
		);
		$table = "jobs";

		init_db_table($fields, $table);
	}
}