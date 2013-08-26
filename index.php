<?php $title='Asteroid!'; include(__DIR__ . '/header.php'); ?>

<div id='flash'>

<div style='margin: 0px auto; text-align: center;'>
<img src='include/logo.png' />
</div><br/>
<center>
<b>Instruktioner</b><br/>
Använd dig utav piltangenterna och skjut med space.<br/>
Försök att samla på dig så mycket poäng innan tiden går ut.</center><br/>
<div style='float: left; width: 200px;'>Dina poäng: <span id='score'>0</span></div>
<div style='float: left; width: 200px;'>Tid: <span id='gameTime'>60</span></div>

<canvas id='canvas1' width='900' height='400' style='background-color: #E0FFFF; border:1px solid #999; '>
  Your browser does not support the element HTML5 Canvas.
</canvas>




<form action='gameover.php' id='gameOver' method='post'>
<input type='hidden' id='gameOverCause' name='gameOverCause' value=''>
<input type='hidden' id='timeScore' name='timeScore' value=''>
<div style='width: 600px; margin: 0px auto;'>
</div>
</form>


</div>

</div>

<?php $path=__DIR__; include(__DIR__ . '/footer.php'); ?>