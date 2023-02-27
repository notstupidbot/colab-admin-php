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
		echo "restore";
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
                'constraint' => '100',
                'unique' => TRUE,
	        ),
		);
		$this->dbforge->add_field($fields);
		$this->dbforge->create_table('tts_project');
	}

}