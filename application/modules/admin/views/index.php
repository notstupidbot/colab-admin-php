<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Admin Panel</title>
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.3.min.js"></script>
	<script src="https://code.jquery.com/jquery-migrate-1.4.0.min.js"></script>
	<script type="text/javascript" src="/public/autobahn.js" crossorigin></script>
	<script type="text/javascript" src="/node_modules/preline/dist/preline.js" crossorigin></script>
<?php
$assets = APPPATH.'../assets/';

foreach (glob($assets.'index*.css') as $filename) {
	?>
    <link rel="stylesheet" href="/assets/<?php echo basename($filename)?>">

	<?php
	break;
}
?>	
	
</head>
<body>
	<div id="root"></div>
	<?php


foreach (glob($assets.'index*.js') as $filename) {
	?>
	<script type="module" crossorigin src="/assets/<?php echo basename($filename)?>"></script>
	<?php
	break;
}?>
</body>

</html>
