var socket = io();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var camera = {
    zoom: 1,
    x: 0,
    y: 0
};

var players = [];
var direction = {
    x: 0,
    y: 0
};

socket.on('playerJoin', function (joinedPlayers) {
    var i;
    for (i in joinedPlayers) {
        var player = joinedPlayers[i];
        players.push(player);
        console.log(player.playerName + ' joined, ' + players.length + ' players.');
    }
});

socket.on('playerLeave', function (player) {
    for (i in players) {
        var p = players[i];
        if (player.playerName === p.playerName) {
            players.splice(i, 1);
            break;
        }
    }
    console.log(player.playerName + ' left, ' + players.length + ' players left.');
});

socket.on('playerMove', function (player) {
    for (i in players) {
        var p = players[i];
        if (player.playerName === p.playerName) {
            p.x = player.x;
            p.y = player.y;
        }
    }
});

function render() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    updateCamera();
    updateTransform();

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(-25, -25, 1525,1025);

    ctx.fillStyle = "#000000";
    ctx.font = "15px Arial";
    for (i in players) {
        var player = players[i];
        ctx.beginPath();
        ctx.arc(player.x, player.y, 25, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillText(player.playerName, player.x - 25, player.y - 30);
    }
};

function updateTransform() {
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -(camera.x - canvas.width * 0.5) * camera.zoom, -(camera.y - canvas.height * 0.5) * camera.zoom);
}

function updateCamera() {
    for(i in players) {
        var player = players[i];
        if(player.me) {
            camera.x = player.x;
            camera.y = player.y;
            break;
        }
    }
}

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
window.onkeyup = function (e) {
    keys[e.keyCode] = false;
    changeDirection();
}
window.onkeydown = function (e) {
    keys[e.keyCode] = true;
    changeDirection();
}

function changeDirection() {
    var x = 0;
    var y = 0;
    if (keys[87]) y = -1;
    else if (keys[83]) y = 1;
    if (keys[68]) x = 1;
    else if (keys[65]) x = -1;

    if (direction.x != x || direction.y != y) {
        direction = {
            x: x,
            y: y
        };
        socket.emit('changeDirection', direction);
    }
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
main();
