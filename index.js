var players = [];
var gameloop = require('node-gameloop');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var width = 5000;
var height = 10000;
var amount = (width * height) / 20000;
var port = process.env.PORT || 3000;
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

var foods = [];
var powers = [];
var mines = [];
var bullets = [];
var walls = [];

for (var i = 0; i < 5; i++){
   addBot();
}
io.on('connection', function(socket) {
    var nameChoose = false;
    socket.emit('massChange', foods, powers, mines, walls, bullets);

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
            flairs: item.flairs,
            r: item.r
        }
    }));


    socket.on('username', function(username, chat, skin) {
        if (nameChoose) return;

        playerIndex++;
        nameChoose = true;

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
        socket.playerSize = 20.00;
        socket.speedUp = 1;

        socket.speed = 5;
        socket.mines = 0;
        socket.r = 0;
        socket.flairs = [];
        socket.direction = {
            x: 0,
            r: 0
        }
         respawn(socket);

        if (socket.handshake.address == "::ffff:80.61.54.121") {
            socket.flairs.push(10);
        }


        players.push(socket);

        socket.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            r: socket.r,
            me: true,
            skin: socket.skin,
            flairs: socket.flairs
        }]);

        socket.broadcast.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            r: socket.r,
            skin: socket.skin,
            flairs: socket.flairs
        }]);

        console.log(socket.playerName + ' connected');


        socket.emit('login', playerIndex);
         socket.emit('chat message', "Welcome to plong.ga! Commands: /reset to reset your player, /colour [colourname] to change background colour","Server");

        socket.on('chat message', function(msg, name) {
            if (msg == ""){}
            else if (msg == "/reset") { resetPlayer(socket); }
            else if (msg == "/resetgame jooj") { resetGame(); }
            else if (msg == "/addbot jooj") { addBot(); }
             else if(msg.indexOf("/resetplayer jooj ") >= 0) {
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
        miner(socket);
        });
         socket.on('shot', function() {
          bullet(socket);
        });
    });
});

//setInterval(function(){resetGame()}, 300000);

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
    var bullets = [];
    for (i = 0; i < players.length; i++) {
        resetPlayer(players[i]);

    }
    if (!winner == null){
        console.log(winner);
 winner.flairs.push(6);
    }
    io.emit('chat message', "Game resetted!", "Server");
    io.emit('massChange', foods, powers, mines, walls, bullets);
}
setInterval(function() {
    var leadObjs = [];
    var lead = players.slice(0);//clone players arra

    lead.sort(function(a, b) {
        return b.playerSize - a.playerSize;
    });

    if(lead[0]){
        var flair = true;
             for (var i = 0; i < lead[0].flairs.length; i++){

                     if (lead[0].flairs[i] == 6){
                         flair = false;
                     }
                 }
        if (flair){
            lead[0].flairs.push(6);


        }
             for (var i = 1; i < lead.length; i++){
            for (var l = 0; l < lead[i].flairs.length; l++){

                     if (lead[i].flairs[l] == 6){

                         lead[i].flairs.splice(l, 1);
                        emitPlayer(lead[i]);
                     }
                 }
            }
    }
    for (var i = 0; i < 5 && i < lead.length; i++){
        var leadObj = {playerName: lead[i].playerName, playerSize: lead[i].playerSize};

        leadObjs.push(leadObj);

io.emit('leaderUpdate', leadObjs);
            }
}, 1000)

var id = gameloop.setGameLoop(function(delta) {

    var foodNow = foods.splice();
    if (Math.random() < 0.05 && foods.length < 2000) {
        food = {
            x: Math.random() * width,
            y: Math.random() * height,
            playerSize: 10,
            foodcolor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
        foods.push(food);
       io.emit('addMass', food);
    }

    if (Math.random() < 0.002 && powers.length < 50) {
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
            x: Math.random() * width,
            y: Math.random() *  height,
            playerSize: 20.00,
            kind: kinder,
            img: img
        };
        powers.push(power);
       io.emit('addPower', power);
    }
moveBots();
for (var i = 0; i < bullets.length; i++) {
  if (bullets[i].lifes < 0) {
      bullets.splice(i, 1);
      io.emit('removeBull', i);
      i--;
    }
    else {
     bullets[i].x -= bullets[i].velX;
    bullets[i].y -= bullets[i].velY;
    bullets[i].lifes -= 0.5;
    for (var p = 0; p < players.length; p++) {
        if (intersect(players[p], bullets[i])) {
            if (bullets[i].owner != players[p].playerName){
            players[p].playerSize -= 2.5;
                for (var l = 0; l < players.length; l++){
                if (players[l].playerName === bullets[i].owner){
                    players[l].playerSize += 2.5;
                    emitPlayer(players[l]);
                    break;
                }
                }
            if (players[p].playerSize < 10) {
                resetPlayer(players[p]);
            }
            else {
                emitPlayer(players[p]);
            }

            io.emit('removeBull', i);
                  bullets.splice(i, 1)
                  i--;
                break;

            }

        }

      bull2 = {x: bullets[i].x, y: bullets[i].y};
    io.emit('moveBull', i, bull2);
    }
    }

}

    movePlayers();

}, 1000 / 60);
function movePlayers() {

    for (i in players) {
        movePlayer(players[i]);
    }


}

function movePlayer(player) {
    if (player.direction.x == 0 && player.direction.r == 0) {
        return;
    }

    if(player.direction.r > 0){
        player.r += 5 * (20 / player.playerSize);
    }
    if(player.direction.r < 0){
        player.r -= 5 * (20 / player.playerSize);
    }
    if(player.direction.x > 0){
        player.direction.x = 1;
    }
    if(player.direction.x < 0){
        player.direction.x = -1;
    }
    player.velX = (player.direction.x > 0 ? player.speed : (player.direction.x < 0 ? (-player.speed) : 0)) * Math.cos(Math.PI / 180 * player.r);
    player.velY = (player.direction.x > 0 ? player.speed : (player.direction.x < 0 ? -player.speed : 0))* Math.sin(Math.PI / 180 * player.r);
    intersectAny(player);
    player.speed = (100 / player.playerSize + 1) * player.speedUp;
    player.x += player.velX;
    player.y += player.velY;
        for (var i = 0; i < walls.length; i++) {
        switch (intersectWall(player, walls[i])) {
                case false:
                        break;
                case 1:
                        player.y -= player.velY;
                        break;
                case 2:
                        player.x -= player.velX;
                        break;
                case true:
                         player.x -= player.velX;
                         player.y -= player.velY;
                        break;

    }
        }
    movePlayerTo(player,
        player.x, player.y);
}

function movePlayerTo(player, x, y) {

    player.x = Math.min(Math.max(player.playerSize, x), (width - player.playerSize)); //add player.playersize
    player.y = Math.min(Math.max(player.playerSize, y), (height - player.playerSize));

    emitPlayer(player);

}

function resetPlayer(socket) {
   socket.bomb = false;
        socket.playerSize = 20.00;
        socket.speedUp = 1;
        socket.speed = 5;
        socket.mines = 0;
    socket.r = 0;
        socket.flairs = [];
        socket.direction = {
            x: 0,
            y: 0,
            r: 0
        }

       if (!socket.robot){
        if (socket.handshake.address == "::ffff:80.61.54.121") {
            socket.flairs.push(10);
        }
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
                player.playerSize += 0.5 * p.playerSize;
                resetPlayer(p);
                emitPlayer(player);
            } else{
                p.playerSize += 0.5 * player.playerSize;
                resetPlayer(player)
                emitPlayer(p);
            }


            intersection(player, p);
        }
    }

    for (var i = 0; i < walls.length; i++) {
        if (intersect(player, walls[i])) {

        }
    }
    for (var i = 0; i < foods.length; i++) {
        var food = foods[i];
        if (intersect(player, food)) {
            player.playerSize = (player.playerSize * 10 + 3) / 10;

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
                   if (player.playerSize < 20) {
                resetPlayer(player);
            }
                    else {
                    emitPlayer(players[p]);
                    }
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
                 player.flairs.splice(i, 1);
                 if (player.speedUp > 1) {
                     player.speedUp -= 1; }
                     }, 3000);
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
    var play = {x: player.x, y: player.y, playerSize: player.playerSize, playerName: player.playerName, flairs: player.flairs, r: player.r};

    io.emit('playerMove', play);
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

function addBot() {
     var socket = [];
        playerIndex++;

        socket.playerName = "Bot  " + playerIndex;

        socket.bomb = false;
        socket.skin = '#' + Math.floor(Math.random() * 16777215).toString(16);
        socket.playerSize = 20.00;
        socket.speedUp = 1;
        socket.speed = 5;
        socket.mines = 0;
        socket.r = 0;
        socket.robot = true;
        socket.flairs = [];
        socket.direction = {
            x: 0,
            r: 0
        }
         respawn(socket);

        players.push(socket);
       io.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            r: socket.r,
            skin: socket.skin,
            flairs: socket.flairs
        }]);
}

function bullet(socket) {
              if (socket.playerSize >= 22.5){
                 var cos = Math.cos(Math.PI / 180 * socket.r);
                 var sin = Math.sin(Math.PI / 180 * socket.r);
            socket.playerSize -= 2.5;
                    emitPlayer(socket);
                       var min = {
                    x: socket.x - (cos * socket.playerSize),
                    y: socket.y - (sin * socket.playerSize),
                    playerSize: 10,
                    colour: socket.skin,
                 };

                 io.emit('addBull', min);
                 min.owner = socket.playerName;
                 min.velX = 10 * cos;
                 min.velY = 10 * sin;
                 min.lifes = 100;
                  bullets.push(min);


             }
}

function moveBots() {
    for (var i = 0; i < players.length; i++) {
    if (players[i].robot) {
        if (players[i].playerSize > 100){
            if (Math.random() < 0.0008){
               bullet(players[i]);
            }
        }
          if (players[i].mines > 0){
            if (Math.random() < 0.001){
               miner(players[i]);
            }
        }
        //console.log(players[i].direction);
        if (players[i].direction.x == -1){
            if (Math.random() < 0.01){
                x = 0;
            }
                else {
                    x = -1;
                }
        }
        if (players[i].direction.x == 0){
            if (Math.random() < 0.05){
                x = -1;
            }
                else {
                    x = 0;
                }
        }

        if (players[i].direction.r == 1){
            if (Math.random() < (0.2 / players[i].playerSize)){
                r = -1;
            }
                else if (Math.random() < (4 / players[i].playerSize)){
                r = 0;
            }
                else {
                    r = 1;
                }
        }
       else if (players[i].direction.r == -1){
            if (Math.random() <  (0.2 / players[i].playerSize)){
                r = 1;
            }
             else if (Math.random() < (4 / players[i].playerSize)){
                r = 0;
            }
                else {
                    r = -1;
                }
        }
         else {
            if (Math.random() < (1 / players[i].playerSize)){
                r = 1;
            }
              else if (Math.random() < (1 / players[i].playerSize)){
                r = -1;
            }
                else {
                    r = 0;
                }
        }

        players[i].direction = {
            x: x,
            r: r
        };
    }
}

}

function miner(socket) {
         if (socket.mines > 0){
            socket.mines -= 1;
                 for (var i = 0; i < socket.flairs.length; i++){
                     if (socket.flairs[i] == 5){
                         socket.flairs.splice(i, 1);
                     }
                 }
                    emitPlayer(socket);
                      var min = {
                    x: socket.x,
                    y: socket.y,
                    playerSize: 50,
                    owner: socket.playerName
                 };
                mines.push(min);
                 io.emit('addMine', min);

             }
}
function intersectWall(player, block){
   var distX = Math.abs(player.x - block.x - block.w / 2);
    var distY = Math.abs(player.y - block.y - block.h / 2);

    if (distX > (block.w / 2 + player.playerSize)) {
        return false;
    }
    if (distY > (block.h / 2 + player.playerSize)) {
        return false;
    }

    if (distX <= (block.w / 2)) { //boven / beneden
     return 1;
    }
    if (distY <= (block.h / 2)) { //link / rechts
        return 2;
    }

    var dx = distX - block.w / 2;
    var dy = distY - block.h / 2;
    return (dx * dx + dy * dy <= (player.playerSize * player.playerSize));
}

http.listen(port, function() {
    console.log('listening on *:3000');
});
