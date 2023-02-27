<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Fixtures extends MX_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function index()
	{
		echo "Load Fixtures database\n";
		$this->tts_project();
		$this->word_list();
		$this->word_list_ttf();
	}

	function tts_project(){
		$rows = [
			['0eb81f8c52f3f50e5c7fdcd50e124d33', '0eb81f8c52f3f50e5c7fdcd50e124d33', 'keputusan politik harus di ukur sejauh mungkin', 7, '["keputusan","politik","harus","di","ukur","sejauh","mungkin"]', ''],
			['7f634e946b04f9564d2d96ca65dcfee6', '7f634e946b04f9564d2d96ca65dcfee6', 'keputusan politik harus di ukur sejauh mungkin karena akan mempengaruhi beberapa hal yang krusial', 14, '["keputusan","politik","harus","di","ukur","sejauh","mungkin","karena","akan","mempengaruhi","beberapa","hal","yang","krusial"]', '']
		];
		$fields = ['id','name', 'text','word_count', 'word_list', 'output_file'];
		foreach($rows as $row){
			$item = [];
			$i = 0;
			foreach( $row as $r){
				$item[$fields[$i]] = $r;
				$i += 1;
			}
			$this->db->insert('tts_project',$item);
		}
	}

	function word_list(){
		$rows = ["keputusan","politik","harus","di","ukur","sejauh","mungkin",'okeh','karena','akan','mempengaruhi','beberapa','hal','yang','krusial'];
		$rows_ttf = ['kəpuˈtusan','poˈlitɪʔ','ˈharʊs','di','ˈukʊr','səˈdʒaʊh','ˈmuŋkɪn','ˈokɛh','karəˈna','ˈakan','məmpəŋaˈruhi', 'bəbəˈrapa','hal','jaŋ' ,'kruˈsial'];
		foreach($rows as $i => $r){
			$item = [
				'id' => gen_uuid(),
				'content' => $r
			];
			$item_ttf = [
				'id' => gen_uuid(),
				'content' => $rows_ttf[$i],
				'word_id' => $item['id'],
				'path' => ''
			];
			$this->db->insert('word_list', $item);
			$this->db->insert('word_list_ttf', $item_ttf);
		}
	}
	function word_list_ttf(){
		$rows = [

		];
	}
}