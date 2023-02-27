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