var gameloop = require('node-gameloop');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

/* Alright, listen here. This is really bad and I know that.
 *  It's just a test server and I don't want to explain to my friends how to use Putty and all that to update the server and restart it when they're playing around with the code.
 *  So, don't put me on /r/ProgrammingHumor okay? Thanks.
 */
app.get('/restart', function (req, res) {
    res.send('Restaring... please be patient');
    process.exit();
});

var intersections = 0;
var playerIndex = 0;
var players = [];
var foods = [];

io.on('connection', function(socket) {
 var nameChoose = false;
   
socket.on('username', function (username) {
    if (nameChoose) return;

    playerIndex++;
    nameChoose = true;
   // socket.playerSize = 30; //verander om groter/kleiner te maken.
    if(username == ""){
        username = "Player " + playerIndex;
    }
    for(var i = 0; i < players.length; i++){
        if(players[i].playerName == username){
            username = username + 2;
        }

    }

   socket.playerName = username;
   socket.playerSize = 20;

    respawn(socket);
    socket.speed = 5; 
 
    socket.direction = {
        x: 0,
        y: 0
    }

    socket.emit('playerJoin', players.map(function (item) { return {playerName: item.playerName, x: item.x, y: item.y, playerSize: item.playerSize}}));

    players.push(socket);

    io.sockets.emit('playerJoin', [{
        playerSize: socket.playerSize,
        playerName: socket.playerName,
        x: socket.x,
        y: socket.y
    }]);

    console.log(socket.playerName + ' connected');


    socket.emit('login', "test value");

   socket.on('chat message', function(msg, name){
    io.emit('chat message', msg, socket.playerName);

  });

   socket.on('reset', function(player){
    resetPlayer(socket);
  });

    socket.on('disconnect', function() {
        var index = players.indexOf(socket);
        players.splice(index, 1);
        console.log(socket.playerName + ' disconnected');
        io.sockets.emit('playerLeave', {
            playerName: socket.playerName
        });
    });

    socket.on('changeDirection', function(direction) {
        socket.direction = direction;
    });
});
});

setInterval(function(){
    var win = 0;
    for(i = 0; i < players.length; i++){
        if (players[i].playerSize > win){
            var winner = players[i];
            win = players[i].playerSize;
        }
    }

    io.emit('chat message', "Winner is: " + winner.playerName, "Server");
    foods = [];
    for(i = 0; i < players.length; i++){
        resetPlayer(players[i]);

        }

    io.emit('chat message', "Game resetted!", "Server");
    io.emit('massChange', foods);

}, 300000);

var id = gameloop.setGameLoop(function(delta) {
    if(Math.random() < 0.02){
    food = {x: Math.random() * 1000, y: Math.random() * 1000, playerSize: 10, foodcolor:'#'+Math.floor(Math.random()*16777215).toString(16)};
    foods.push(food);
    //io.emit('massChange', foods);
    }
    movePlayers();
}, 1000/60);

function movePlayers() {
    for(i in players) {
        movePlayer(players[i]);
    }
    io.emit('massChange', foods);
}

function movePlayer(player) {
    if(player.direction.x == 0 && player.direction.y == 0) {
        return;
    }

    intersectAny(player);
    player.speed = 100 / player.playerSize + 2;
    movePlayerTo(player, 
                 player.x + (player.direction.x > 0 ? player.speed : (player.direction.x < 0 ? -player.speed : 0)), 
                 player.y + (player.direction.y > 0 ? player.speed : (player.direction.y < 0 ? -player.speed : 0)));
}
function spawnMass(){
    player.x = Math.min(Math.max(player.playerSize, x), (1500 - player.playerSize)); //add player.playersize
    player.y = Math.min(Math.max(player.playerSize, y), (1000 - player.playerSize));
}
function movePlayerTo(player, x, y) {
    
    player.x = Math.min(Math.max(player.playerSize, x), (1500 - player.playerSize)); //add player.playersize
    player.y = Math.min(Math.max(player.playerSize, y), (1000 - player.playerSize));
    emitPlayer(player);

}

function resetPlayer(player) {
    player.playerSize = 20;
    respawn(player);
}
function intersectAny(player) {

    for(var i in players) {
        var p = players[i];
        if(player == p){
            continue;
        }
        if(intersect(player, p)) {
            if (player.playerSize > p.playerSize){
                player.playerSize += 0.2 * p.playerSize;
                resetPlayer(p);
                emitPlayer(player);
            }
            else {
                p.playerSize += 0.2 * player.playerSize;
                resetPlayer(player)
                emitPlayer(p);
            }


            intersection(player, p);
        }
    }
    for(var i in foods){
        var food = foods[i];
         if(intersect(player, food)) {
            player.playerSize += 1;
            foods.splice(i, 1);
            // io.emit('massChange', foods);
        }
    }
}

function emitPlayer(player){
    io.sockets.emit('playerMove', {
                 playerSize: player.playerSize,
                 playerName: player.playerName,
                 x: player.x,
                 y: player.y
             });
}

function intersection(player1, player2){
    intersections += 1;
    var messaged = "Total intersections: " + intersections + ", last one by: " + player1.playerName + " and " + player2.playerName;
    console.log(messaged);
     io.emit('chat message', messaged, "Server");
}
function intersect(player1, player2) {
    return Math.pow(Math.abs(player1.x - player2.x), 2) + Math.pow(Math.abs(player1.y - player2.y), 2) < Math.pow(player1.playerSize + player2.playerSize, 2);//diameter of the size of
//    return false;

}

function respawn(player) {

    movePlayerTo(player, Math.round(Math.random() * (1500 - player.playerSize)), Math.round(Math.random() * (1000 - player.playerSize)));
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
