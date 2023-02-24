<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Admin Panel</title>
<?php
$assets = APPPATH.'../assets/';

foreach (glob($assets.'source*.css') as $filename) {
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


foreach (glob($assets.'app*.js') as $filename) {
	?>
	<script type="module" crossorigin src="/assets/<?php echo basename($filename)?>"></script>
	<?php
	break;
}?>
</body>

</html>
