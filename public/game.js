var socket = io();
var connected = false;
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(200, 200, 200)";
var back = new Image();
back.src = "http://www.nasa.gov/sites/default/files/styles/image_card_4x3_ratio/public/thumbnails/image/idcs1426.jpg";
var players = [];
var foods = [];
var direction = {
    x: 0,
    y: 0
};

socket.on('massChange', function(eat) {
    foods = eat;
});
socket.on('playerJoin', function (joinedPlayers) {

    for(i in joinedPlayers) {
        var player = joinedPlayers[i];

        players.push(player);
        console.log(player.playerName + ' joined, ' + players.length + ' players.');
    }
});

socket.on('login', function (player) {
   document.getElementById("jj").style.display = "block";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("startScreen").style.display = "none";
    connected = true;

  });

socket.on('playerLeave', function(player) {
    var index = -1;
    for(i in players) {
        var p = players[i];
        if(player.playerName == p.playerName) {
            index = i;
        }
    }
    if(i == -1) {
        return;
    }
    players.splice(index, 1);
    console.log(player.playerName + ' left, ' + players.length + ' players left.');
});

socket.on('playerMove', function(player) {
    for(i in players) {
        var p = players[i];
        if(player.playerName == p.playerName) {
            p.x = player.x;
            p.y = player.y;
            p.playerSize = player.playerSize;
        }
    }
});

var render = function () {
    //ctx.drawImage(back, 0, 0, 1500, 1000);
     for(i = 0; i < foods.length; i++) {
        food = foods[i];

        ctx.fillStyle = food.foodcolor;
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.playerSize, 0, 2 * Math.PI, false);
        ctx.fill();
      //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }

    for(i in players) {
        
        player = players[i];
        
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.playerSize, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.font = "15px Arial";
        ctx.fillText(player.playerName, player.x - 25, player.y - player.playerSize - 5);
    }


};

var main = function () {
    var now = Date.now();
    var delta = now - then;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    render();

    then = now;

    requestAnimationFrame(main);
};

var keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false; changeDirection();}
window.onkeydown = function(e) {keys[e.keyCode]=true; changeDirection();}

function changeDirection() {
    var x = 0;
    var y = 0;

    if(document.activeElement.tagName != "INPUT"){
    if(keys[87] || keys[38]){ y = -1;}
    else if(keys[83] || keys[40]){ y= 1;}
    if(keys[68] || keys[39]){ x = 1;}
    else if(keys[65] || keys[37]){ x = -1;}

    if(direction.x != x || direction.y != y) {
        direction = {
            x: x,
            y: y
        };
        socket.emit('changeDirection', direction);
    }
    }
}

function nameChoose(){
    var name = document.getElementById("nameInput").value;
    socket.emit('username', name);
}

function resetClient(){
    socket.emit('reset', "code");
}
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
main();
