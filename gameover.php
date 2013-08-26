<?php $title='Asteroid! - Game Over'; include(__DIR__ . '/header.php'); ?>

<div id='flash'>

<div style='margin: 0px auto; text-align: center;'>
<img src='include/logo.png' /><br/><br/>

<?php
if ($_POST['gameOverCause'] == "1") {
	$gameOn = 1;
	echo "<span style='font-size: 40px; color: #000000;'>Game over!</span><br/><p>Tiden är över!.</p>";
} elseif ($_POST['gameOverCause'] == "2") {
	$gameOn = 1;
	echo "<span style='font-size: 40px; color: #000000;'>Game over!</span><br/><p>Du körde in i en komet och dog!</p>";
} else { echo "<i>Du har inte spelat än...</i>"; }
?>

<p>
<?php
if ($gameOn) {
$myScore  = $_POST['timeScore'];
$divided = explode(",", $myScore);
echo "Dina poäng: " . $divided[0] . "<br/>";
}
?>
</p>

Spela igen? <a href='index.php'>Klicka här</a>



</div>

</div>

<?php $path=__DIR__; include(__DIR__ . '/footer.php'); ?>