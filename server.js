// Dependencies
let express = require('express');
let path = require('path');
let app = express();
let http = require('http').createServer(app); // Create server for heroku
let io = require('socket.io')(http);

let PORT = process.env.PORT || 3000;

//Routing
app.get('/', function(req, res)
{    
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('static'));
app.use(express.static('public'));

//Port listening
http.listen(PORT, function()
{
    console.log('Listening on port: ' + PORT + '.'); 
});

//Game objects
let players = {};
//Screen size
let mapHeight = 500;
let mapWidth = 1000;

//Socket handlers
io.on('connection', function(socket) {
  console.log('New player connected. Connected: %s sockets connected.', (Object.keys(players).length+1));
  //Player object
  socket.on('new player', function() {
    players[socket.id] = {
      id: socket.id,
      height: 40,
      width: 20,
      x: getRandomValue(10, 990),
      //x: 500, // change later
      y: 200,
      speed: 10,
      yVelocity: 0,
      gravity: 0.5,
      jumping: true,
    }; 
    //Send client identification data
    socket.emit('clientid', players[socket.id]);
  });
  //Player movement
  socket.on('movement', function(data) {
    let player = players[socket.id] || {};
    //Received control commands
    if (data.left) {
      player.x -= player.speed;
    }
    if (data.up && !player.jumping) {
      player.jumping = true;
      player.yVelocity -= 15;
      player.y += player.yVelocity;
    }
    if(data.right) {
      player.x += player.speed;
    }
    //Gravity functionality
    if(player.y<(mapHeight-player.height)) {
      player.yVelocity += player.gravity;
      player.y += player.yVelocity
    }
    //When on ground
    if(player.y >= (mapHeight-player.height)) {
      player.jumping = false;
      player.yVelocity = 0;
    }
    });
  //Player disconnect
  socket.on('disconnect', function() {
    //Remove disconnected player
    delete players[socket.id];
    console.log('Player disconnected. Connected: %s sockets connected', (Object.keys(players).length));  
  });
});
//Update player movement to clients
setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);
//Return random number between two values
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

