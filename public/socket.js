var socket = io.connect();
var connected = false;
socket.on('leaderUpdate', function(lead) {
    var myNode = document.getElementById("lead");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
       // document.getElementById('lead').innerHTML = '';
    for (i = 0; i < lead.length; i++) {

        gameBoard = document.createElement("li");
        var text = document.createTextNode(lead[i].playerName + "  " + Math.round(lead[i].playerSize * 10));
        gameBoard.appendChild(text);
        document.getElementById('lead').appendChild(gameBoard);

    }
})
socket.on('roomSize', function(size) {
    width = size.width;
    height = size.height;
});


socket.on('playerJoin', function(joinedPlayers) {
    for (i in joinedPlayers) {
        var player = joinedPlayers[i];

        players.push(player);
        console.log(player.playerName + ' joined, ' + players.length + ' players.');
    }
});

socket.on('login', function(player) {
    if(checkbox){
    document.getElementById("chat").style.display = "block";
    }
    document.getElementById("gameCanvas").style.opacity = "1";
    document.getElementById("leaders").style.opacity = "1";
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameCanvas").style.zIndex = "0";
    // connected = true;
    //playerNumber = player;

});

//mass / bullets
socket.on('massChange', function(eat, pup, mins, wal, bulles) {
    powers = pup;
    foods = eat;
    mines = mins;
    walls = wal;
    bullets = bulles;
});
socket.on('addMass', function(data) {
    foods.push(data);
});
socket.on('removeMass', function(i) {
    foods.splice(i, 1);
});
socket.on('addBull', function(data) {
    bullets.push(data);
});
socket.on('removeBull', function(i) {
    bullets.splice(i, 1);
});
socket.on('moveBull', function(i, data) {
    bullets[i].x = data.x;
    bullets[i].y = data.y;
});
socket.on('addPower', function(data) {
    powers.push(data);
});
socket.on('removePower', function(i) {
    powers.splice(i, 1);
});

socket.on('addMine', function(min) {
    mines.push(min);
});
socket.on('removeMine', function(i) {
    mines.splice(i, 1);
});
socket.on('flairUpdate', function(flairs, i){
    players[i].flairs = flairs;
})
socket.on('flairUpdate', function(flairs, i){
    players[i].flairs = flairs;
})
socket.on('playerLeave', function(player) {
    players.splice(player.i, 1);
    console.log(player.playerName + ' left, ' + players.length + ' players left.');

});
socket.on('discon', function(player) {

goBack();

})
socket.on('playerMove', function(player) {
    for (i in players) {
        var p = players[i];
        if (player.playerName == p.playerName) {
            p.x = player.x;
            p.y = player.y;
            p.playerSize = player.playerSize;
            p.flairs = player.flairs;
            p.r = player.r;
            p.speedUp = player.speedUp;
        }
    }
});
