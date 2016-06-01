var gameloop = require('node-gameloop');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var playerIndex = 0;
var players = [];

io.on('connection', function (socket) {
    socket.playerName = "Player" + playerIndex;
    playerIndex++;
    respawn(socket);
    socket.speed = 5;
    socket.direction = {
        x: 0,
        y: 0
    }

    socket.emit('playerJoin', players.map(function (item) {
        return {
            playerName: item.playerName,
            x: item.x,
            y: item.y
        }
    }));

    players.push(socket);

    io.sockets.emit('playerJoin', [{
        playerName: socket.playerName,
        x: socket.x,
        y: socket.y
    }]);

    console.log(socket.playerName + ' connected');

    socket.on('disconnect', function () {
        var index = players.indexOf(socket);
        players.splice(index, 1);
        console.log(socket.playerName + ' disconnected');
        io.sockets.emit('playerLeave', {
            playerName: socket.playerName
        });
    });

    socket.on('changeDirection', function (direction) {
        socket.direction = direction;
    });
});


var id = gameloop.setGameLoop(function (delta) {
    movePlayers();
}, 1000 / 60);

function movePlayers() {
    for (i in players) {
        movePlayer(players[i]);
    }
}

function movePlayer(player) {
    if (player.direction.x == 0 && player.direction.y == 0) {
        return;
    }

    intersectAny(player);

    movePlayerTo(player,
        player.x + (player.direction.x > 0 ? player.speed : (player.direction.x < 0 ? -player.speed : 0)),
        player.y + (player.direction.y > 0 ? player.speed : (player.direction.y < 0 ? -player.speed : 0)));
}

function movePlayerTo(player, x, y) {
    player.x = Math.min(Math.max(0, x), 1500);
    player.y = Math.min(Math.max(0, y), 1000);
    io.sockets.emit('playerMove', {
        playerName: player.playerName,
        x: player.x,
        y: player.y
    });
}

function intersectAny(player) {
    for (var i in players) {
        var p = players[i];
        if (player == p) {
            continue;
        }
        if (intersect(player, p)) {
            respawn(player);
            respawn(p);
        }
    }
}

function intersect(player1, player2) {
    return Math.pow(Math.abs(player1.x - player2.x), 2) + Math.pow(Math.abs(player1.y - player2.y), 2) < 50 * 50;
    //    return false;
}

function respawn(player) {
    movePlayerTo(player, Math.round(Math.random() * 1000), Math.round(Math.random() * 1000));
}

http.listen(3000, function () {
    console.log('listening on *:3000');
});
