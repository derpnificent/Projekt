/**
 * Playing Asteroids while learning JavaScript object model.
 */

/** 
 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */ 
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var dateTest = Date.now();
var myShot = new Audio("include/lasergun.mp3");
var myBoom = new Audio("include/boom.mp3");
var myBgSound = new Audio("include/PhotoOp.wav");

/**
 * Shim layer, polyfill, for cancelAnimationFrame with setTimeout fallback.
 */
window.cancelRequestAnimFrame = (function(){
  return  window.cancelRequestAnimationFrame || 
          window.webkitCancelRequestAnimationFrame || 
          window.mozCancelRequestAnimationFrame    || 
          window.oCancelRequestAnimationFrame      || 
          window.msCancelRequestAnimationFrame     || 
          window.clearTimeout;
})();



/**
 * Trace the keys pressed
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
 */
window.Key = {
  pressed: {},

  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40,
  SPACE:  32,
  A:      65,
  S:      83,
  D:      68,
  W:      87,
  
  isDown: function(keyCode, keyCode1) {
    return this.pressed[keyCode] || this.pressed[keyCode1];
  },
  
  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
    //console.log(event.keyCode);
  },
  
  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
  },
  
  stopShooting: function() {
      delete this.pressed[32];
  }
};
window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);



/**
 * All positions and forces 
 */
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

Vector.prototype = {
  muls:  function (scalar) { return new Vector( this.x * scalar, this.y * scalar); }, 
  imuls: function (scalar) { this.x *= scalar; this.y *= scalar; return this; },      
  adds:  function (scalar) { return new Vector( this.x + scalar, this.y + scalar); },
  iadd:  function (vector) { this.x += vector.x; this.y += vector.y; return this; }  
}

function Forces() {
  this.all = {};
}
 
Forces.prototype = {
 
  createAcceleration: function(vector) {
    return function(velocity, td) {
      velocity.iadd(vector.muls(td));
    }
  },
 
  createDamping: function(damping) {
    return function(velocity, td) {
      velocity.imuls(damping);
    }
  },
 
  createWind: function(vector) {
    return function(velocity, td) {
      velocity.iadd(vector.adds(td));
    }
  },  
 
  addAcceleration:  function(name, vector)  { this.all[name] = this.createAcceleration(vector); },
  addDamping:       function(name, damping) { this.all[name] = this.createDamping(damping); },
  addWind:          function(name, vector)  { this.all[name] = this.createWind(vector); },
 
  update: function(object, td) {
    for(var force in this.all) {
      if (this.all.hasOwnProperty(force)) {
        this.all[force](object, td);
      }
    }
  }
 
}
 
window.Forces = new Forces();
window.Forces.addAcceleration('gravity', new Vector(0, 9.82));
window.Forces.addDamping('drag', 0.97);
window.Forces.addWind('wind', new Vector(0.5, 0));

var MyAsteroid = {};
// Min asteroid
function Asteroid() {
  MyAsteroid.height          	= 40;
  MyAsteroid.width           	= 40;
  MyAsteroid.position        	= new Vector(getRandomInt(0,850),getRandomInt(0,350));
  MyAsteroid.speed				= getRandomInt(50,120);
  MyAsteroid.direction			= getRandomIntwithDec(-3,-6);
}

Asteroid.prototype = {
	draw: function(ct) {
		ct.beginPath();
		ct.moveTo(MyAsteroid.position.x, MyAsteroid.position.y);
		ct.lineTo(MyAsteroid.position.x-11, MyAsteroid.position.y -13);
		ct.lineTo(MyAsteroid.position.x+3, MyAsteroid.position.y -16);
		ct.lineTo(MyAsteroid.position.x+3, MyAsteroid.position.y -9);
		ct.lineTo(MyAsteroid.position.x+11, MyAsteroid.position.y -11);
		ct.lineTo(MyAsteroid.position.x+11, MyAsteroid.position.y -3);
		ct.lineTo(MyAsteroid.position.x+7, MyAsteroid.position.y -1);
		ct.lineTo(MyAsteroid.position.x+10, MyAsteroid.position.y +6);
		ct.lineTo(MyAsteroid.position.x+4, MyAsteroid.position.y +13);
		ct.lineTo(MyAsteroid.position.x-9, MyAsteroid.position.y +9);
		ct.lineTo(MyAsteroid.position.x-15, MyAsteroid.position.y);
		ct.closePath();
		ct.stroke();
		ct.restore();
    ct.fillStyle = '#708090';
    ct.fill();
	},
  
	update: function(td) {
		MyAsteroid.position.x += MyAsteroid.speed * Math.cos(MyAsteroid.direction) * td;
		MyAsteroid.position.y += MyAsteroid.speed * Math.cos(MyAsteroid.direction) * td;
		this.stayInArea(width, height);	
	},

	stayInArea: function(width, height) {
		if(MyAsteroid.position.y < -MyAsteroid.height) {
			MyAsteroid.position.y = height;
			MyAsteroid.direction = getRandomIntwithDec(4,5);
			MyAsteroid.speed = getRandomInt(50,120);
		}

    if(MyAsteroid.position.y-20 > height) {
		MyAsteroid.position.y = -MyAsteroid.height+10;
		MyAsteroid.direction = getRandomIntwithDec(1,2);
		MyAsteroid.speed = getRandomInt(50,120);
	}

    if(MyAsteroid.position.x > width) {
		MyAsteroid.position.x = -MyAsteroid.width;
		MyAsteroid.direction = getRandomIntwithDec(1,5);;
		MyAsteroid.speed = getRandomInt(50,120);
	}

    if(MyAsteroid.position.x < -MyAsteroid.width) {
		MyAsteroid.position.x = width;
		MyAsteroid.direction = getRandomIntwithDec(2,4);;
		MyAsteroid.speed = getRandomInt(50,120);
	}	
  }
  
};

// Randomizer
function getRandomInt(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) +min;
};

function getRandomIntwithDec(min,max) {
	return Math.random() * (max - min).toFixed(2) + min;
};


function Player(width, height, position, velocity, speed, direction, accelerateForce, breakForce, dampForce) {
  this.height     = height    || 32;
  this.width      = width     || 32;
  this.position   = position  || new Vector();
  this.velocity   = velocity  || new Vector();
  this.speed      = speed     || new Vector();
  this.direction  = direction || 0;
  this.accelerateForce  = accelerateForce || Forces.createAcceleration(new Vector(80, 80));
  this.breakForce       = breakForce      || Forces.createDamping(0.97);
  this.dampForce        = dampForce       || Forces.createDamping(0.999);
}

Player.prototype = {
  draw: function(ct) {
    var x = this.width/2, y = this.height/2;

    ct.save();
    ct.translate(this.position.x, this.position.y);
    ct.rotate(this.direction+Math.PI/2)
    ct.beginPath();
    ct.moveTo(0, -y);
    ct.lineTo(x, y);
    ct.lineTo(0, 0.8*y);
    ct.lineTo(-x, y);
    ct.lineTo(0, -y);
	ct.fillStyle = '#8B0000';
	ct.fill();

    if (Key.isDown(Key.UP, Key.W)) {
      ct.moveTo(0, y);
      ct.lineTo(-2, y+10);
      ct.lineTo(0, y+8);
      ct.lineTo(2, y+10);
      ct.lineTo(0, y);
    } 
    
    if (Key.isDown(Key.DOWN, Key.S)) {
      ct.moveTo(y+4, 0);
      ct.arc(0, 0, y+4, 0, Math.PI, true);
    }

	if (Key.isDown(Key.SPACE) && nrOfShots<2) {
    myShot.play();
    shots[nrOfShots++] = new Bullet(this.direction, 10, 10, this.position.x, this.position.y);
    Key.stopShooting();
  }

    ct.stroke();
    ct.restore();

	if(this.position.x > MyAsteroid.position.x-12 && this.position.x < MyAsteroid.position.x+10 && this.position.y > MyAsteroid.position.y-12 && this.position.y < MyAsteroid.position.y+10){
		document.getElementById('gameOverCause').value = '2';
		document.getElementById('timeScore').value = document.getElementById('score').innerHTML;
		document.getElementById('gameOver').submit();
	}

	for(var i=0; i < nrOfShots ; i++) {
    shots[i].x +=  Math.cos(shots[i].direction) * shots[i].speedX;
    shots[i].y +=  Math.sin(shots[i].direction) * shots[i].speedY;
          
    ct.save();
    ct.translate(shots[i].x, shots[i].y);
    ct.beginPath();
    ct.moveTo(-1, -1);
    ct.lineTo(0, -4);
    ct.strokeStyle = '#000000';
    ct.stroke();
    ct.restore();
      
    //Se om skotten är utanför skärmen. Isf, ta bort.
    if(shots[i].y < -this.height || shots[i].y > height || shots[i].x > width || shots[i].x < -this.width){
		shots[i]=shots[nrOfShots-1];
		nrOfShots--;
    }

	if(shots[i].x > MyAsteroid.position.x-12 && shots[i].x < MyAsteroid.position.x+10 && shots[i].y > MyAsteroid.position.y-12 && shots[i].y < MyAsteroid.position.y+10){
        myBoom.play();
		shots[i] = shots[nrOfShots-1];
        nrOfShots--;
        nrOfHits++;
		MyAsteroid.position.x = getRandomInt(0,850);
		MyAsteroid.position.y = getRandomInt(0,350);
		MyAsteroid.speed = getRandomInt(50,120);
		MyAsteroid.direction = getRandomIntwithDec(-3,-6);
		document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML) + 1;
    } 

    }
  },

  moveForward: function() {
    this.dampForce(this.speed, td);
    this.position.x += this.speed.x * Math.cos(this.direction) * td;
    this.position.y += this.speed.y * Math.sin(this.direction) * td;
    this.position.iadd(this.velocity.muls(td));
  },

  rotateLeft:  function() { this.direction -= Math.PI/30; },
  rotateRight: function() { this.direction += Math.PI/30; },

  throttle: function(td)  { this.accelerateForce(this.speed, td); },
  breaks:   function(td)  { this.breakForce(this.speed, td); this.breakForce(this.velocity, td); },

  update: function(td, width, height) {
    if (Key.isDown(Key.UP, Key.W))     this.throttle(td);
    if (Key.isDown(Key.LEFT, Key.A))   this.rotateLeft();
    if (Key.isDown(Key.DOWN, Key.S))   this.breaks(td);
    if (Key.isDown(Key.RIGHT, Key.D))  this.rotateRight();

    Forces.update(this.velocity, td);
    this.moveForward(td);
    this.stayInArea(width, height);

  },

  stayInArea: function(width, height) {
    if(this.position.y < -this.height)  this.position.y = height;
    if(this.position.y > height)        this.position.y = -this.height;
    if(this.position.x > width)         this.position.x = -this.width;
    if(this.position.x < -this.width)   this.position.x = width;
  }
}

// Räkna antal skott
var shots = new Array();
var nrOfShots = 0;

// The number of hits variable
var nrOfHits = 0;

//The bullet constructor
function Bullet(direction, speedX, speedY, x, y)  {
  this.direction       = direction || 0;
  this.speedX        = speedX  || 0;
  this.speedY        = speedY  || 0;
  this.x           = x     || 0;
  this.y           = y     || 0;
}

//Array asteroid
var asteroid = new Array();
var nrOfAsteroids=0;


window.Asteroids = (function(){
  var canvas, ct, ship, lastGameTick, asteroid, shipPos;

  var init = function(canvas) {
    canvas = document.getElementById(canvas);
    ct = canvas.getContext('2d');
    width = canvas.width,
    height = canvas.height,
    ct.lineWidth = 1;
    ct.strokeStyle = 'hsla(0,0%,100%,1)',
    ship = new Player(10, 20, new Vector(width/2, height/2));

	asteroid = new Asteroid();	
	//asteroid[nrOfAsteroids] = new Asteroid();
    console.log('Init the game');
  };

  var update = function(td) {
    ship.update(td, width, height);
	asteroid.update(td);
  };

  var render = function() {
    ct.clearRect(0,0,width,height);
    ship.draw(ct);
	asteroid.draw(ct);
  };

  var gameLoop = function() {
    var now = Date.now();
    td = (now - (lastGameTick || now)) / 1000; // Timediff since last frame / gametick
    lastGameTick = now;
    requestAnimFrame(gameLoop);
    update(td);
    render();
  };

  return {
    'init': init,
    'gameLoop': gameLoop
  }
})();


var count = 60;
var counter = setInterval(timer, 1000);

function timer() {
  count=count-1;
  if (count <= -1) {
	clearInterval(counter);
	document.getElementById('gameOverCause').value = '1';
	document.getElementById('timeScore').value = document.getElementById('score').innerHTML;
    document.getElementById('gameOver').submit();
    return;
  }

  document.getElementById('gameTime').innerHTML = count;
}


// On ready
$(function(){
	if(document.getElementById('canvas1')) {
		'use strict';
		Asteroids.init('canvas1');
		Asteroids.gameLoop();
		myBgSound.play();
		myBgSound.loop = true;
		console.log('Ready to play.');
	}
});