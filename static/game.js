//Connect client
let socket = io({transports: ['websocket'], 
                upgrade: false, });

//Define player movement
var movement = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false
}
document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: // Left arrow
      case 65: // A
      movement.left = true;
      break;
      case 32: // Spacebar
      case 38: // Up arrow
      case 87: // W
      movement.up = true;
      break;
      case 39: // Right arrow
      case 68: // D
      movement.right = true;
      break;
      case 40: // Down arrow
      case 83: // S
      movement.down = true;
      break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 37: // Left arrow
      case 65: // A
      movement.left = false;
      break;
      case 32: // Spacebar
      case 38: // Up arrow
      case 87: // W
      movement.up = false;
      break;
      case 39: // Right arrow
      case 68: // D
      movement.right = false;
      break;
      case 40: // Down arrow
      case 83: // S
      movement.down = false;
      break;
    }
});
//Send player movement state to server 60 times per second
socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

//Game canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var origWidth = 1000;
var origHeight = 500;

canvas.style.height = '100%';
canvas.style.width=(canvas.style.height/origHeight)*origWidth+'%';
var height = canvas.offsetHeight;
var width = canvas.offsetWidth;

canvas.height = height;
canvas.width = (height/origHeight)*origWidth;

var scaleW = canvas.width / origWidth;
var scaleH = canvas.height / origHeight;

var scaleF = scaleW*scaleH;

window.onresize = function(e) {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;

  canvas.width = (height/origHeight)*origWidth;
  canvas.height = height;  
  
  scaleW = canvas.width / origWidth;
  scaleH = canvas.height / origHeight;

  scaleF = scaleW*scaleH;
}

socket.on('state', function(players) {
  //Draw players
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'black';
  for (var id in players) { 
    var player = players[id];
    context.beginPath();
    context.strokeRect(scaleW*player.x, scaleH*player.y, player.width*scaleW, player.height*scaleH);
  }
});



