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

let clientPlayerx = 0;
let origo = 0;
let offset = 0;

socket.on('state', function(players) {
  //Draw players
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'black';
  for (let id in players) { 
    let player = players[id];
    context.beginPath();
    if(player.id === clientSocket.id) {
      if(origo === 0) { //Get the original spawn point
        origo = scaleW*player.x; //Get the center point
        offset = origo-500*scaleW-(player.width*scaleW)/2; //Checks how far the spawn coords are from 500
      }
      clientPlayerx = scaleW*player.x-origo; //Move everything based on origo. e.g origo-offset keeps player centered
      context.strokeRect(origo-offset, scaleH*player.y, player.width*scaleW, player.height*scaleH); //Draw client player

    } else {
      context.strokeRect(scaleW*player.x-clientPlayerx-offset, scaleH*player.y, player.width*scaleW, player.height*scaleH); //Draw other players
    }
    //Render 2 random pieces clientside, replace these later when you make a proper map
    context.strokeRect(scaleW*20-clientPlayerx-offset, scaleH*350, 50*scaleW, 150*scaleH);
    context.strokeRect(scaleW*930-clientPlayerx-offset, scaleH*350, 50*scaleW, 150*scaleH);
  }
});




