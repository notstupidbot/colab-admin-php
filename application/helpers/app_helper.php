<?php

function md5sum($text){
	$output_file =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));
    file_put_contents($output_file, $text);
    return md5sumFile($output_file);
}

function md5sumFile($path){
	$stdout =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        shell_exec("md5sum -u ".$path . " 2>&1 >".$stdout);
        $md5sum = file_get_contents($stdout);
        if(!$md5sum){
        	$md5sum = shell_exec("md5sum ".$path);
        }

    } else {
        $md5sum = shell_exec("md5sum ".$path);
        
    }
    $md5sum = explode(' ', $md5sum);
    unlink($stdout);
    return $md5sum[0];
}

function removeDuplicateSum($src_filename, $sum, $dir, $prefix, $ext, $verbose=true)
{
	$files = glob($dir . '/' . $prefix . '*.' . $ext);

	foreach($files as $file){

		if($file == $src_filename){
			// echo "SKIP " . basename($file) . "\n";
			continue;
		}
		if(md5sumFile($file) == $sum){
			$realpath = realpath($file);
			unlink($file);
			if($verbose){
						echo '-->Unlink ' . $realpath . "\n";
			}
		}
	}
}

function gen_uuid() {
    return sprintf( '%04x%04x%04x%04x%04x%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

function dump_table($table, $backup_dir, $verbose = true)
{
	$ci = get_instance();
	if($verbose){
		echo "Start backup " . $table . "\n";
	}
	$filename = $table . '@' . date("dmYHis") . '.json';
	$count = $ci->db->count_all($table);
	$data = [];
	$file_location =  $backup_dir . '/'. $filename;

	if($count){
		if($verbose){
			echo '-->Processing ' . $count . ' rows' . "\n-->";
		}
		
		$db = $ci->db->query('SELECT * FROM '. $table);

		foreach($db->result() as $row ){
			echo '.';

			$data[] = $row;
		}
		file_put_contents($file_location, json_encode($data));
		if($verbose){
			echo "\n-->Saving json dump to " . realpath($file_location) . "\n";
		}

		$file_location_sum = md5sumFile($file_location);
		removeDuplicateSum($file_location, $file_location_sum, $backup_dir, $table . '@', 'json');

	}else{
		if($verbose){
			echo "-->" . 'There is nothing to be done' . "\n";
		}
	}
}

function dt_dump_filename($filename){
	/* Convert filename to date */
	$filename_split = explode('@',str_replace('.json', '', $filename));
	$dt_filename_src = $filename_split[1];
	$dt_d_filename = substr($dt_filename_src, 0,2);
	$dt_m_filename = substr($dt_filename_src, 2,2);
	$dt_y_filename = substr($dt_filename_src, 4,4);
	$dt_h_filename = substr($dt_filename_src, 8,2);
	$dt_i_filename = substr($dt_filename_src, 10, 2);
	$dt_s_filename = substr($dt_filename_src, 12,2);
	$dt_filename = "$dt_y_filename-$dt_m_filename-$dt_d_filename $dt_h_filename:$dt_i_filename:$dt_s_filename";

	// echo $dt_filename_src."\n";
	// echo $dt_filename."\n";
	return $dt_filename;
}

function restore_json_dump($table, $filename, $pk = "id"){
	$ci = get_instance();
	$json_buffer = file_get_contents($filename);
	$rows = json_decode($json_buffer);
	// print_r($json_buffer);
	foreach($rows as $row){
		// echo $row->id . "\n";
		$existing_row = $ci->db->where($pk,$row->$pk)->get($table)->row();
		if($existing_row){
			$ci->db->from($table)->where($pk,$row->$pk)->delete();
		}
		// sleep(1);
		echo ".";
		$ci->db->insert($table, $row);	

	}
	echo "\n";
}

function convert_ttf($text){
	$text = strtolower($text);
	
	$shell_path = realpath(APPPATH . "../addon/convert-ttf.sh");
    $shell_cmd =  "sudo bash ".$shell_path ." \"". $text . "\" ";
	$stdout =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));
	$content = shell_exec("which python3" . " 2>&1");
	echo $shell_cmd;
	echo $content;
	exit();
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$stdout =  tempnam(sys_get_temp_dir(), md5('tts-api'.date('YmdHis')));

        $shell_cmd = "python ". realpath(APPPATH . "../addon/convert-ttf-win.py")." ". $text . " $stdout 2>&1";
        shell_exec($shell_cmd); 
        $content = file_get_contents($stdout);
    	unlink($stdout);
    }else{
    	$content = shell_exec($shell_cmd); 
    } 

    
    return $content;
   
}

function init_db_table($fields, $table, $verbose=true){
	$ci = get_instance();
	$ci->load->dbforge();

	$ci->dbforge->add_field($fields);
	if($verbose)
		echo "DROP TABLE $table\n";
	$ci->dbforge->drop_table($table,true);
	if($verbose)
		echo "CREATE TABLE $table\n";

	$ci->dbforge->create_table($table);
}

function load_db_dump($backup_dir){
	$ci = get_instance();
	$tables = $ci->db->list_tables();

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