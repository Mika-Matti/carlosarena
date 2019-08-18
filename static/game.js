//Connect client
let socket = io({transports: ['websocket'], 
                upgrade: false, });
//Define player movement
let movement = {
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

//Client data
let clientSocket = {};

//Game canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let origWidth = 1000;
let origHeight = 500;

canvas.style.height = '100%';
canvas.style.width = (canvas.style.height/origHeight)*origWidth+'%';
let height = canvas.offsetHeight;
let width = canvas.offsetWidth;

canvas.height = height;
canvas.width = (height/origHeight)*origWidth;

let scaleW = canvas.width / origWidth;
let scaleH = canvas.height / origHeight;

let scaleF = scaleW*scaleH;

window.onresize = function(e) {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;

  canvas.width = (height/origHeight)*origWidth;
  canvas.height = height;  
  
  scaleW = canvas.width / origWidth;
  scaleH = canvas.height / origHeight;

  scaleF = scaleW*scaleH;
}
//Receive your socket id from server
socket.on('clientid', function(data) {
  clientSocket = data;
});

socket.on('state', function(players) {
  //Draw players
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'black';
  for (let id in players) { 
    let player = players[id];
    context.beginPath();
    if(player.id === clientSocket.id) {
      //Make horizontal camera focus on client player
      context.strokeRect(scaleW*player.x, scaleH*player.y, player.width*scaleW, player.height*scaleH);
    } else {
      context.strokeRect(scaleW*player.x, scaleH*player.y, player.width*scaleW, player.height*scaleH);
    }
  }
});




