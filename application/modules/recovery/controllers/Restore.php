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
		$this->word_list();
		$this->word_list_ttf();
		$this->socket_session();


		$this->load_db_dump();
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
		);
		$this->dbforge->add_field($fields);
		echo "DROP TABLE tts_project\n";

		$this->dbforge->drop_table('tts_project',true);
		echo "CREATE TABLE tts_project\n";

		$this->dbforge->create_table('tts_project');
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
		);
		$this->dbforge->add_field($fields);
		echo "DROP TABLE word_list\n";
		$this->dbforge->drop_table('word_list',true);
		echo "CREATE TABLE word_list\n";

		$this->dbforge->create_table('word_list');
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
		);
		$this->dbforge->add_field($fields);
		echo "DROP TABLE word_list_ttf\n";

		$this->dbforge->drop_table('word_list_ttf',true);
		echo "CREATE TABLE word_list_ttf\n";

		$this->dbforge->create_table('word_list_ttf');
	}

	function load_db_dump()
	{
		echo "Loading db tables dump\n";

		// Declare two dates in different
		// format
		$filename = "tts_project@27022023121011.json";

		$dt_filename = dt_dump_filename($filename);


		$tables = $this->db->list_tables();
		$backup_dir = APPPATH . '../db';

		foreach($tables as $table){
			$dump_files = glob("$backup_dir/$table@*.json");

			$tm_latest = strtotime("1986-09-18");
			$dump_file_latest = "";

			foreach($dump_files as $dump_file){
				
				$filename = basename($dump_file);
				$dt_filename = dt_dump_filename($dump_file);
				// echo $dt_filename . "\n";
				$tm_filename = strtotime($dt_filename);
				if($tm_filename > $tm_latest){
					$tm_latest = $tm_filename;
					$dump_file_latest = $dump_file;
				}
			}
			if(!is_file($dump_file_latest)){
				continue;
			}
			echo "Processing table $table\n";
			echo "Processing ".realpath($dump_file_latest)."\n";

			restore_json_dump($table, $dump_file);
		}

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
		);
		$this->dbforge->add_field($fields);
		echo "DROP TABLE word_list\n";
		$this->dbforge->drop_table('socket_session',true);
		echo "CREATE TABLE word_list\n";

		$this->dbforge->create_table('socket_session');
	}
}