var gameloop = require('node-gameloop');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var width = 5000;
var height = 5000;
app.use(express.static(path.join(__dirname, 'public')));

/* Alright, listen here. This is really bad and I know that.
 *  It's just a test server and I don't want to explain to my friends how to use Putty and all that to update the server and restart it when they're playing around with the code.
 *  So, don't put me on /r/ProgrammingHumor okay? Thanks.
 */
app.get('/restart', function(req, res) {
    res.send('Restaring... please be patient');
    process.exit();
});

var intersections = 0;
var playerIndex = 0;
var players = [];
var foods = [];
var powers = [];
var mines = [];

io.on('connection', function(socket) {
    var nameChoose = false;
    socket.emit('massChange', foods, powers, mines);

    socket.emit('roomSize', {
        width: width,
        height: height
    });

    socket.emit('playerJoin', players.map(function(item) {
        return {
            playerName: item.playerName,
            x: item.x,
            y: item.y,
            playerSize: item.playerSize,
            skin: item.skin,
            flairs: item.flairs
        }
    }));


    socket.on('username', function(username, chat, skin) {
        if (nameChoose) return;

        playerIndex++;
        nameChoose = true;
        // socket.playerSize = 30; //verander om groter/kleiner te maken.
        if (username === "") {
            username = "Player " + playerIndex;
        }
        for (var i=0;i<players.length;i++) {
            if (players[i].playerName == username) {
                username = username + 2;
            }

        }
        socket.bomb = false;
        socket.skin = skin;
        socket.playerName = username;
        socket.playerSize = 20;
        socket.speedUp = 1;
        respawn(socket);
        socket.speed = 5;
        socket.mines = 0;
        socket.flairs = [];
        socket.direction = {
            x: 0,
            y: 0
        }

        if (socket.handshake.address == "::ffff:80.61.54.121") {
            console.log("Ik ben geweldig");
            socket.flairs.push(10);
        }
        players.push(socket);

        socket.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            me: true,
            skin: socket.skin,
            flairs: socket.flairs
        }]);
        socket.broadcast.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            skin: socket.skin,
            flairs: socket.flairs
        }]);

        console.log(socket.playerName + ' connected');


        socket.emit('login', playerIndex);
         socket.emit('chat message', "Welcome to plong.ga! Commands: /reset to reset your player, /colour [colourname] to change background colour","Server");

        socket.on('chat message', function(msg, name) {
            if (msg == ""){}
            else if (msg == "/reset") { resetPlayer(socket); }
            else if (msg == "/resetgame jojo") { resetGame(); }

             else if(msg.indexOf("/resetplayer jojo ") >= 0) {
           choosenOne = msg.substr(18);
                 for (i = 0; i < players.length; i++){
                     if(players[i].playerName == choosenOne){
                         resetPlayer(players[i]);
                     }
                 }
             }

            else {
                io.emit('chat message', msg, socket.playerName);
            }
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
         socket.on('emitBomb', function(direction) {
             if (socket.mines > 0){
            socket.mines -= 1;
                 for (var i = 0; i < socket.flairs.length; i++){
                     if (socket.flairs[i] == 5){
                         socket.flairs.splice(i, 1);
                     }
                 }
            emitPlayer(socket);
                 min = {
            x: socket.x,
            y: socket.y,
            playerSize: 50,
            owner: socket.playerName
                 };
                mines.push(min);
                 io.emit('addMine', min);

             }
        });
    });
});
setInterval(function(){resetGame()}, 300000);

function resetGame(){
     var win = 0;
    for (i = 0; i < players.length; i++) {
        if (players[i].playerSize > win) {
            var winner = players[i];
            win = players[i].playerSize;
            ia = i;
        }
    }
    if (winner == null) {
        io.emit('chat message', "No players participated ", "Server");
    } else {
        io.emit('chat message', "Winner is: " + winner.playerName, "Server");

        emitPlayer(winner);
    }
    foods = [];
    powers = [];
    mines = [];
    for (i = 0; i < players.length; i++) {
        resetPlayer(players[i]);

    }
    if (!winner == null){
 winner.flairs.push(6);
    }
    io.emit('chat message', "Game resetted!", "Server");
    io.emit('massChange', foods, powers, mines);
}
setInterval(function() {
    var leadObjs = [];
    var lead = players.slice(0); //clone players

    lead.sort(function(a, b) {
        return b.playerSize - a.playerSize;
    });
    for (i = 0; i < 5 && i < lead.length; i++){
        var leadObj = {playerName: lead[i].playerName, playerSize: lead[i].playerSize};
        leadObjs.push(leadObj);

io.emit('leaderUpdate', leadObjs);
            }
}, 1000)
var id = gameloop.setGameLoop(function(delta) {
if (players.length > 0){
    var foodNow = foods.splice();
    if (Math.random() < 0.08) {
        food = {
            x: Math.random() * height,
            y: Math.random() * width,
            playerSize: 10,
            foodcolor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
        foods.push(food);
       io.emit('addMass', food);
    }
    if (Math.random() < 0.002) {
        switch (Math.round(Math.random() * 2)) {
    case 0:
        kinder = "speed";
        img = 3;
        break;
    case 1:
        kinder = "bomb";
        img = 4;
        break;
    case 2:
        kinder = "mines";
        img = 5;
        break;
}
        power = {
            x: Math.random() * height,
            y: Math.random() * width,
            playerSize: 20,
            kind: kinder,
            img: img
        };
        powers.push(power);
       io.emit('addPower', power);
    }
    movePlayers();
}
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
    player.speed = (200 / player.playerSize + 1) * player.speedUp;
    movePlayerTo(player,
        player.x + (player.direction.x > 0 ? player.speed : (player.direction.x < 0 ? -player.speed : 0)),
        player.y + (player.direction.y > 0 ? player.speed : (player.direction.y < 0 ? -player.speed : 0)));
}

function movePlayerTo(player, x, y) {

    player.x = Math.min(Math.max(player.playerSize, x), (width - player.playerSize)); //add player.playersize
    player.y = Math.min(Math.max(player.playerSize, y), (height - player.playerSize));

    emitPlayer(player);

}

function resetPlayer(socket) {
   socket.bomb = false;
        socket.playerSize = 20;
        socket.speedUp = 1;
        socket.speed = 5;
        socket.mines = 0;
        socket.flairs = [];
        socket.direction = {
            x: 0,
            y: 0
        }

        if (socket.handshake.address == "::ffff:80.61.54.121") {
            console.log("Ik ben geweldig");
            socket.flairs.push(10);
        }

    respawn(socket);
}

function intersectAny(player) {

    for (var i in players) {
        var p = players[i];
        if (player == p) {
            continue;
        }
        if (intersect(player, p)) {
            if (player.playerSize > p.playerSize && p.bomb == false|| player.bomb == true && p.bomb == false || player.bomb == true && p.bomb == true && player.playerSiz > p.playerSize) {
                player.playerSize += 0.2 * p.playerSize;
                resetPlayer(p);
                emitPlayer(player);
            } else{
                p.playerSize += 0.2 * player.playerSize;
                resetPlayer(player)
                emitPlayer(p);
            }


            intersection(player, p);
        }
    }
    for (var i = 0; i < foods.length; i++) {
        var food = foods[i];
        if (intersect(player, food)) {
            player.playerSize += 1;

            foods.splice(i, 1);

            io.emit('removeMass', i);
        }
    }
   for (var i = 0; i < mines.length; i++) {
        var mine = mines[i];
        if (intersect(player, mine)) {
            if (mine.owner != player.playerName){
            var exSize = player.playerSize / 2;
            player.playerSize -= exSize;
             for (var p = 0; p < players.length; p++){
                if (players[p].playerName === mine.owner){
                    players[p].playerSize += 0.5 * exSize;
                    emitPlayer(players[p]);
                }
            }
            mines.splice(i, 1);
            emitPlayer(player);
            io.emit('removeMine', i);
            }
        }
    }

    for (var i = 0; i < powers.length; i++) {
        var power = powers[i];
        if (intersect(player, power)) {
        if(power.kind == "speed"){
            player.speedUp += 1;

            player.flairs.push(3);
             var speedy = setTimeout(function(){
                 for (i = 0; i < player.flairs.length; i++){
                       if (player.flairs[i] == 3){
                           player.flairs.splice(i, 1);
                           break;
                       }
                   }
                 player.flairs.splice(i, 1); player.speedUp -= 1 }, 3000);
        }
            else if (power.kind == "bomb"){
                player.bomb = true;
            player.flairs.push(4);
               var bomby = setTimeout(function(){
                   for (i = 0; i < player.flairs.length; i++){
                       if (player.flairs[i] == 4){
                           player.flairs.splice(i, 1);
                           break;
                       }
                   }
                   player.bomb = false}, 3000);
            }
            else if (power.kind == "mines"){
                player.flairs.push(5);
                player.mines += 1;
            }
            powers.splice(i, 1);

            io.emit('removePower', i);
        }
    }
}

function emitPlayer(player) {
    play = {x: player.x, y: player.y, playerSize: player.playerSize, playerName: player.playerName, flairs: player.flairs};
    io.sockets.emit('playerMove', {
        playerSize: play.playerSize,
        playerName: play.playerName,
        x: play.x,
        y: play.y,
        flairs: play.flairs
    });
}

function intersection(player1, player2) {
    intersections += 1;
    var messaged = "Total intersections: " + intersections + ", last one by: " + player1.playerName + " and " + player2.playerName;
    console.log(messaged);
    io.emit('chat message', messaged, "Server");
}

function intersect(player1, player2) {
    //var biggestSize = Math.max(player1.playerSize, player2.playerSize);
    return Math.pow(Math.abs(player1.x - player2.x), 2) + Math.pow(Math.abs(player1.y - player2.y), 2) < Math.pow(player1.playerSize + player2.playerSize, 2); //diameter of the size of
    //    return false;

}

function respawn(player) {

    movePlayerTo(player, Math.round(Math.random() * (width - player.playerSize)), Math.round(Math.random() * (height - player.playerSize)));
}

http.listen(3000, function() {
    console.log('listening on *:3000');
});
