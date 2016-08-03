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
var names = ["SuperVark", "Jesse", "Apvark", "reddit", "Netherlands", "Cool", "Oh Wow", "kill you", "LOL", "plongga", "djDaBoot", "Someone", "Football", "USA", "cool", "Turkey"];
for (bot = 0; bot < 10; bot++) {
    addBot();
}
for (var ii = 0; ii < 50; ii++) {
    addWall();
}

io.on('connection', function(socket) {
    socket.nameChoose = false;
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

            r: item.r,
            pu: socket.pu
        }
    }));


    socket.on('username', function(username, chat, skin) {
        if (socket.nameChoose) return;

        playerIndex++;
        socket.nameChoose = true;

        if (username === "") {
            username = "Player " + playerIndex;
        }
        for (var i = 0; i < players.length; i++) {
            if (players[i].playerName == username) {
                username = username + 2;
            }

        }
        socket.bumpX = 0;
        socket.bumpY = 0;
        socket.fric = 0;
        socket.bomb = false;
        socket.skin = skin;
        socket.playerName = username;
        socket.playerSize = 20.00;
        socket.speedUp = 1;
        socket.shoot = true;
        socket.speed = 5;
        socket.mines = 0;
        socket.r = 0;
        socket.pu = 0;

        socket.direction = {
            x: 0,
            r: 0
        }
        respawn(socket);


        players.push(socket);

        socket.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            r: socket.r,
            me: true,
            skin: socket.skin,

            speedUp: socket.speedUp,
            pu: socket.pu
        }]);

        socket.broadcast.emit('playerJoin', [{
            playerSize: socket.playerSize,
            playerName: socket.playerName,
            x: socket.x,
            y: socket.y,
            r: socket.r,
            skin: socket.skin,

            pu: socket.pu
        }]);
        console.log(socket.playerName + ' connected');


        socket.emit('login', playerIndex);
        socket.emit('chat message', "Welcome to plong.ga! Commands: /reset to restart your game, /colour [colourname] to change background colour", "Server");




    });
    socket.on('chat message', function(msg, name) {
        if (msg == "") {} else if (msg == "/reset") {
            resetPlayer(socket);
        } else if (msg == "/resetgame jooj") {
            resetGame();
        } else if (msg == "/addbot jooj") {
            addBot();
        } else if (msg == "/addmass jooj") {
            socket.playerSize += 100;
        } else if (msg.indexOf("/resetplayer jooj ") >= 0) {
            choosenOne = msg.substr(18);
            for (i = 0; i < players.length; i++) {
                if (players[i].playerName == choosenOne) {
                    resetPlayer(players[i]);
                }
            }
        } else {
            io.emit('chat message', msg, socket.playerName);
        }
    });

    socket.on('disconnect', function() {
        if (socket.nameChoose) {
            var index = players.indexOf(socket);

            players.splice(index, 1);
            console.log(socket.playerName + ' disconnected');
            io.emit('playerLeave', {
                playerName: socket.playerName,
                i: index
            });
        }
    });
    socket.on('changeDirection', function(direction) {
        socket.direction = direction;
    });

    socket.on('emitBomb', function(direction) {

        if (socket.pu == 3) {

                socket.speedUp = 2;

        var speedy = setTimeout(function() {

                        socket.speedUp = 1;

                 powerE(socket,0);
                }, 3000);
        }

        if (socket.pu == 4) {
                socket.bomb = true;

                var bomby = setTimeout(function() {powerE(socket,0);socket.bomb = false}, 10000);
        }

        if (socket.pu == 5) {
            miner(socket);
        }

    });

    socket.on('shot', function() {
        bullet(socket);
    });
});


setInterval(function() {
    var leadObjs = [];
    var lead = players.slice(0); //clone players arra

    lead.sort(function(a, b) {
        return b.playerSize - a.playerSize;
    });

    for (var i = 0; i < lead.length; i++) { //&& i < 5
        var leadObj = {
            playerName: lead[i].playerName,
            playerSize: lead[i].playerSize
        };

        leadObjs.push(leadObj);
    }
    io.emit('leaderUpdate', leadObjs);

}, 1000);

var id = gameloop.setGameLoop(function(delta) {

    //food creating
    var foodNow = foods.splice();
    if (Math.random() < 0.05 && foods.length < 1000) {
        food = {
            x: Math.random() * width,
            y: Math.random() * height,
            playerSize: 6,
            foodcolor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
        foods.push(food);
        io.emit('addMass', food);
    }


    //powerup creating
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
            y: Math.random() * height,
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
                    if (bullets[i].owner != players[p].playerName) {
                        if (players[p].bomb == false){
                        players[p].playerSize -= 2.5;

                        for (var l = 0; l < players.length; l++) {
                            if (players[l].playerName === bullets[i].owner) {
                                players[l].playerSize += 2.5;
                                emitPlayer(players[l]);
                                break;
                            }
                        }

                        if (players[p].playerSize < 15) {
                            resetPlayer(players[p]);
                        }
                        else {
                            emitPlayer(players[p]);
                        }
                        }
                        io.emit('removeBull', i);

                        bullets.splice(i, 1)
                        i--;
                        break;

                    }

                }

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
    {
    if (player.fric == 0 && player.direction.x == 0 && player.direction.y == 0) {
        return;
    }

    player.bumpX -= 0.02 * player.bumpX;
    if (player.bumpX < 0.01 && player.bumpX > 0 || player.bumpX > -0.01 && player.bumpX < 0) {
        player.bumpX = 0;
    }
    player.bumpY -= 0.05 * player.bumpY;
    if (player.bumpY < 0.01 && player.bumpY > 0 || player.bumpY > -0.01 && player.bumpY < 0) {
        player.bumpY = 0;
    }
    if (Math.abs(player.fric) > 0.01) {
        player.fric -= 0.1 * player.fric;
    } else {
        player.fric = 0;
    }

    if (player.direction.r > 0) {
        player.r += 4;
    }
    if (player.direction.r < 0) {
        player.r -= 4;
    }
    if (player.direction.x > 0 && player.fric < 1.5) {
        player.fric += 0.1;
    }
    if (player.direction.x < 0 && player.fric > -1.5) {
        player.fric += -0.1;
    }
    player.speed = player.fric * 5 * player.speedUp;

    var newX = player.speed * Math.cos(Math.PI / 180 * player.r);
    var newY = player.speed * Math.sin(Math.PI / 180 * player.r);
    player.velX = newX; //laatste moment die kant op
    player.velY = newY;
    intersectAny(player);

    player.x += player.bumpX + player.velX;
    player.y += player.bumpY + player.velY;

        }
    for (var i = 0; i < walls.length; i++) {
        if (intersect(player, walls[i])) {

            resetPlayer(player);
        }
    }

    if (player.x + player.playerSize > width || player.x - player.playerSize < 0 || player.y + player.playerSize > height || player.y - player.playerSize < 0) {
        resetPlayer(player);
    } else {
        movePlayerTo(player,
            player.x, player.y);
    }
}



function movePlayerTo(player, x, y) {


    player.x = x;
    player.y = y;
    emitPlayer(player);

}

function msDelete(object, array, removeAfterMs) {
    array.push(object)

    io.emit('addMass', object);

    setTimeout(() => {
        var idx = array.indexOf(object);
        if (idx > -1) {
            io.emit('removeMass', idx);
            array.splice(idx, 1);
        }
    }, removeAfterMs)
}

function resetPlayer(socket) {

    for (var i = 0; i < socket.playerSize; i += 1) {

        var pt_angle = Math.random() * 2 * Math.PI; //random angle
        var pt_radius_sq = Math.random() * socket.playerSize * socket.playerSize; // random piece on that angle
        var sx = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
        var sy = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
        var x = sx + socket.x;
        var y = sy + socket.y;

        var food = {
            x: x,
            y: y,
            playerSize: 6,
            foodcolor: socket.skin
        };

        msDelete(food, foods, 10000);

    }

    if (!socket.robot) {
        socket.nameChoose = false;
        var index = players.indexOf(socket);
        players.splice(index, 1);
        io.emit('playerLeave', {
            playerName: socket.playerName,
            i: index
        });

        socket.emit('discon', "hmm");
    } else {
        socket.bomb = false;
        socket.playerSize = 20;
        socket.speedUp = 1;
        socket.speed = 5;
        socket.shoot = true;
        socket.mines = 0;
        socket.r = 0;

        socket.direction = {
            x: 0,
            y: 0,
            r: 0
        }

        respawn(socket);


    }

}

function intersectAny(player) {

    for (var i in players) {
        var p = players[i];
        if (player == p) {
            continue;
        }
        if (intersect(player, p)) {
            p.bumpX = 1.5 * player.velX * ((player.playerSize / 100 + 1) / (p.playerSize / 100 + 1));
            p.bumpY = 1.5 * player.velY * ((player.playerSize / 100 + 1) / (p.playerSize / 100 + 1));

            player.bumpX = 1.5 * p.velX * ((p.playerSize / 100 + 1) / (player.playerSize / 100 + 1));
            player.bumpY = 1.5 * p.velY * ((p.playerSize / 100 + 1) / (player.playerSize / 100 + 1));

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
            if (mine.owner != player.playerName) {
                var exSize = player.playerSize / 2;
                player.playerSize -= exSize;
                for (var p = 0; p < players.length; p++) {
                    if (players[p].playerName === mine.owner) {
                        players[p].playerSize += 0.5 * exSize;
                        emitPlayer(players[p]);
                    }
                }
                if (player.playerSize < 20) {
                    resetPlayer(player);
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
            if (power.kind == "speed") {
             /*   player.speedUp += 1;
                 powerE(player,3);
                var speedy = setTimeout(function() {
                    if (player.speedUp > 1) {
                        player.speedUp -= 1;
                    }
                 powerE(player,0);
                }, 3000); */
               powerE(player, 3);
            } else if (power.kind == "bomb") {
                powerE(player, 4);
            }
            else if (power.kind == "mines") {
              powerE(player,5);
                player.mines += 1;
            }
           powers.splice(i,1);
        io.emit('removePower', i);
        }

    }
}

function emitPlayer(player) {

    var play = {
        x: player.x,
        y: player.y,
        playerSize: player.playerSize,
        playerName: player.playerName,
        fric: player.fric,
        r: player.r,
        speedUp: player.speedUp
    };

    io.emit('playerMove', play);
}

function intersect(player1, player2) {

    return Math.pow(Math.abs(player1.x - player2.x), 2) + Math.pow(Math.abs(player1.y - player2.y), 2) < Math.pow(player1.playerSize + player2.playerSize, 2);

}

function respawn(player) {

    movePlayerTo(player, Math.round(Math.random() * (width - player.playerSize)), Math.round(Math.random() * (height - player.playerSize)));
}

function addBot() {
    var socket = [];
    playerIndex++;
    var ran = Math.round(Math.random() * (names.length));

    socket.playerName = names[ran];
    //socket.playerName = playerIndex;
    if (socket.playerName == undefined) {
        socket.playerName = "Bot " + playerIndex;
    }
    names.splice(ran, 1);
    socket.bumpX = 0;
    socket.bumpY = 0;
    socket.bomb = false;
    socket.skin = '#' + Math.floor(Math.random() * 16777215).toString(16);
    socket.playerSize = 20.00;
    socket.shoot = true;
    socket.speedUp = 1;
    socket.speed = 5;
    socket.mines = 0;
    socket.pu = 0;
    socket.r = 0;
    socket.fric = 0;
    socket.robot = true;

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

        pu: socket.pu
    }]);

}

function addWall() {
    var x = Math.round(Math.random() * (width - 100));
    var y = Math.round(Math.random() * (height - 100));
    var well = {
        x: x,
        y: y,
        playerSize: 100
    };
    walls.push(well);
}

function bullet(socket) {
    if (socket.playerSize >= 22.5 && socket.shoot) {
        var cos = Math.cos(Math.PI / 180 * socket.r);
        var sin = Math.sin(Math.PI / 180 * socket.r);
        socket.playerSize -= 2.5;
        emitPlayer(socket);
        var min = {
            x: socket.x - (cos * socket.playerSize),
            y: socket.y - (sin * socket.playerSize),
            playerSize: 10,
            colour: socket.skin,
            velX: 10 * cos,
            velY: 10 * sin
        };

        io.emit('addBull', {
            x: socket.x - (cos * socket.playerSize),
            y: socket.y - (sin * socket.playerSize),
            playerSize: 10,
            colour: socket.skin,
            velX: cos,
            velY: sin
        });
        min.owner = socket.playerName;

        min.lifes = 100;

        bullets.push(min);
        socket.shoot = false;
        setTimeout(function() {
            socket.shoot = true;
        }, 300);

    }
}

function moveBots() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].robot) {
            if (players[i].playerSize > 100) {
                if (Math.random() < 0.0008) {
                    bullet(players[i]);
                }
            }
            if (players[i].mines > 0) {
                if (Math.random() < 0.001) {
                    miner(players[i]);
                }
            }

            if (players[i].direction.x == -1) {
                if (Math.random() < 0.01) {
                    x = 0;
                } else {
                    x = -1;
                }
            }
            if (players[i].direction.x == 0) {
                if (Math.random() < 0.05) {
                    x = -1;
                } else {
                    x = 0;
                }
            }

            if (players[i].direction.r == 1) {
                if (Math.random() < (0.2 / players[i].playerSize)) {
                    r = -1;
                } else if (Math.random() < (4 / players[i].playerSize)) {
                    r = 0;
                } else {
                    r = 1;
                }
            } else if (players[i].direction.r == -1) {
                if (Math.random() < (0.2 / players[i].playerSize)) {
                    r = 1;
                } else if (Math.random() < (4 / players[i].playerSize)) {
                    r = 0;
                } else {
                    r = -1;
                }
            } else {
                if (Math.random() < (1 / players[i].playerSize)) {
                    r = 1;
                } else if (Math.random() < (1 / players[i].playerSize)) {
                    r = -1;
                } else {
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
    if (socket.pu == 5) {
        socket.pu = 0;
       powerE(socket, socket.pu);

        var min = {x: socket.x, y: socket.y, playerSize: 15, owner: socket.playerName};

        mines.push(min);
        io.emit('addMine', min);

    }
}

function powerE(socket, num) {
if (socket.nameChoose){
    var index = players.indexOf(socket);
    players[index].pu = num;
    io.emit('poup', index, num);
}
}
http.listen(port, function() {
    console.log('listening on *:3000');
});
