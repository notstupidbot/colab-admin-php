<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Admin Panel</title>
<?
$assets = APPPATH.'../assets/';

foreach (glob($assets.'source*.css') as $filename) {
	?>
    <link rel="stylesheet" href="/assets/<?=basename($filename)?>">

	<?
	break;
}
?>	
	
</head>
<body>
	<div id="root"></div>
	<?


foreach (glob($assets.'app*.js') as $filename) {
	?>
	<script type="module" crossorigin src="/assets/<?=basename($filename)?>"></script>
	<?
	break;
}?>
</body>

</html>