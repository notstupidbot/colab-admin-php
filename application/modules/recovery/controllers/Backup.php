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
		$this->tts_project();
		$this->word_list();
		$this->word_list_ttf();
	}

	public function tts_project()
	{
		$table = "tts_project";

		$backup_dir = APPPATH . '../db';
		dump_table($table, $backup_dir);
	}


	public function word_list()
	{
		$table = "word_list";
		$backup_dir = APPPATH . '../db';
		dump_table($table, $backup_dir);
	}
	public function word_list_ttf()
	{
		$table = "word_list_ttf";
		$backup_dir = APPPATH . '../db';
		dump_table($table, $backup_dir);
	}

}