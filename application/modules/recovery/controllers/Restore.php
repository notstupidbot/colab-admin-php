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
		/*
"id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "text" text COLLATE "pg_catalog"."default",
  "word_count" int4,
  "word_list" json,
  "output_file" varchar(255) COLLATE "pg_catalog"."default",
  "name" varchar COLLATE "pg_catalog"."default"

  $fields = array(
		        'id' => array(
		                'type' => 'INT',
		                'constraint' => 5,
		                'unsigned' => TRUE,
		                'auto_increment' => TRUE
		        ),
		        'blog_title' => array(
		                'type' => 'VARCHAR',
		                'constraint' => '100',
		                'unique' => TRUE,
		        ),
		        'blog_author' => array(
		                'type' =>'VARCHAR',
		                'constraint' => '100',
		                'default' => 'King of Town',
		        ),
		        'blog_description' => array(
		                'type' => 'TEXT',
		                'null' => TRUE,
		        ),
		);
		*/
		$this->tts_project();
		$this->word_list();
		$this->word_list_ttf();
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

}