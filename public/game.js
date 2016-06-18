var socket = io();
var connected = false;
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var players = [];
var foods = [];
var powers = [];
var mines = [];
var direction = {
    x: 0,
    y: 0
};
var mines = [];
var width, height;
var backColour = 0;
var camera = {
    zoom: 1,
    x: 0,
    y: 0
};

//skins/images
var images = [];
function preload() {
				for (i = 0; i < preload.arguments.length; i++) {
					images[i] = new Image()
					images[i].src = preload.arguments[i]
				}
			}
preload(
"https://pbs.twimg.com/profile_images/693492259791200256/z0oxKdVO.png",
"http://www.lunapic.com/editor/premade/transparent.gif",
"http://i.imgur.com/9gWLFFH.png",
"http://www.nssmag.com/assets/extensions/labs/sites/bbhmm/images/powerup-2.png",
"http://www.nssmag.com/assets/extensions/labs/sites/bbhmm/images/powerup-4.png",
"http://www.sireasgallery.com/iconset/minesweeper/Mine_256x256_32.png",
"http://findicons.com/files/icons/2799/flat_icons/256/trophy.png",
"http://bestdesignoptions.com/wp-content/uploads/2009/06/grass-texture-10.png",
"http://orig01.deviantart.net/6cc2/f/2011/361/e/0/seamless_ground_texture_by_lauris71-d4kd616.png",
"http://simpleicon.com/wp-content/uploads/football.svg",
"http://downloadicons.net/sites/default/files/crown-symbol-64788.png",
"http://i4.istockimg.com/file_thumbview_approve/77377365/5/stock-photo-77377365-seamless-dark-green-grass-digital-texture.jpg");
images[7].onerror = function() {
images[7].src = images[11].src;
    };

socket.on('leaderUpdate', function(lead) {
        document.getElementById('lead').innerHTML = '';

    for (i = 0; i < lead.length; i++) {

        gameBoard = document.createElement("li");
        var text = document.createTextNode(lead[i].playerName + "  " + Math.round(lead[i].playerSize));
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
    // connected = true;
    //playerNumber = player;

});

//mass / bullets
socket.on('massChange', function(eat, pup, mins) {
    powers = pup;
    foods = eat;
    mines = mins;
});
socket.on('addMass', function(food) {
    foods.push(food);
});
socket.on('removeMass', function(i) {
    foods.splice(i, 1);
});
socket.on('addPower', function(pup) {
    powers.push(pup);
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

socket.on('playerLeave', function(player) {
    var index = -1;
    for (i in players) {
        var p = players[i];
        if (player.playerName == p.playerName) {
            index = i;
        }
    }
    if (i == -1) {
        return;
    }
    players.splice(index, 1);
    console.log(player.playerName + ' left, ' + players.length + ' players left.');
});

socket.on('playerMove', function(player) {
    for (i in players) {
        var p = players[i];
        if (player.playerName == p.playerName) {
            p.x = player.x;
            p.y = player.y;
            p.playerSize = player.playerSize;
            p.flairs = player.flairs;
        }
    }
});

function render() {

    player = {x: width / 2, y: height / 2};

    for(i in players) {
        var p = players[i];
        if(p.me) {
            player = p;
            break;
        }
    }

    if(!player) {
       return;// player = players[0];
    }

    ctx.setTransform(1,0,0,1,0,1);
    ctx.fillStyle = "#734A12";
   ctx.fillStyle = ctx.createPattern(images[8], "repeat");
    ctx.fillRect(0,0,canvas.width,canvas.height);
    updateCamera(player);
    updateTransform();

     ctx.fillStyle = ctx.createPattern(images[7], "repeat");
   if(!backColour == 0){
       ctx.fillStyle = backColour;
   }


    ctx.fillRect(0, 0, width, height);

    ctx.font = "15px Arial";

    //ctx.drawImage(back, 0, 0, 1500, 1000);
    for (i = 0; i < foods.length; i++) {
        food = foods[i];

        ctx.fillStyle = food.foodcolor;
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.playerSize, 0, 2 * Math.PI, false);
        ctx.fill();
        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }

    for (i = 0; i < powers.length; i++) {
        power = powers[i];
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(power.x, power.y, power.playerSize, 0, 2 * Math.PI, false);
         ctx.fill();
        ctx.drawImage(images[power.img], power.x - (0.5 * power.playerSize), power.y - (0.5 * power.playerSize), power.playerSize, power.playerSize);


        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }
     for (i = 0; i < mines.length; i++) {

        mine = mines[i];
        ctx.drawImage(images[5], mine.x - (0.5 * mine.playerSize), mine.y - (0.5 * mine.playerSize), mine.playerSize, mine.playerSize);
        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }

    ctx.fillStyle = "#000000";

    for (i in players) {

        player = players[i];
       ctx.beginPath();
        ctx.fillStyle = player.skin;
        ctx.arc(player.x, player.y, player.playerSize, 0, (2 * Math.PI), false);
          ctx.fill();
        ctx.drawImage(images[9], player.x - (1.15 * player.playerSize), player.y - (1.15 * player.playerSize), player.playerSize * 2.3, player.playerSize * 2.3);

if (images[player.skin]){
        ctx.drawImage(images[player.skin], player.x - (0.5 * player.playerSize), player.y - (0.5 * player.playerSize), player.playerSize, player.playerSize);
}
      ctx.fillStyle = "#000000";
        var koala = player.playerName.length;
        ctx.fillText(player.playerName, player.x - (koala * 3.5), player.y - (player.playerSize * 1.2));
        for(i = 0; i < player.flairs.length; i++){
            ctx.drawImage(images[player.flairs[i]], player.x - (3.5 * koala) - (11 * i) - 15, player.y - 10 - (player.playerSize * 1.2), 10, 10);
        }
    }

};

function updateTransform() {
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -(camera.x - canvas.width * 0.5) * camera.zoom, -(camera.y - canvas.height * 0.5) * camera.zoom);
}

function updateCamera(player) {
    camera.x = player.x;
    camera.y = player.y;
}

var main = function() {

    var now = Date.now();
    var delta = now - then;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    render();

    then = now;

    requestAnimationFrame(main);
};

var keys = [];
window.onkeyup = function(e) {
    keys[e.keyCode] = false;
    changeDirection();
}
window.onkeydown = function(e) {
    keys[e.keyCode] = true;
    changeDirection();
    if (keys[13]){

        document.getElementById("m").focus();
    }
}

function changeDirection() {
    var x = 0;
    var y = 0;

    if (document.activeElement.tagName != "INPUT") {
        if (keys[87] || keys[38]) {
            y += -1;
        }
        if (keys[83] || keys[40]) {
            y += 1;
        }
        if (keys[68] || keys[39]) {
            x += 1;
        }
        if (keys[65] || keys[37]) {
            x += -1;
        }
         if (keys[32]) {
            socket.emit('emitBomb', "data");
        }
        if (direction.x != x || direction.y != y) {
            direction = {
                x: x,
                y: y
            };
            socket.emit('changeDirection', direction);
        }

    }
}
setInterval(function() {
  //  checkLeaders();
}, 1000);

function checkLeaders() {

    var lead = players.slice(0); //clone players

    lead.sort(function(a, b) {
        return b.playerSize - a.playerSize;
    });

    document.getElementById('lead').innerHTML = '';

    for (i = 0; i < lead.length && i < 5; i++) {

        gameBoard = document.createElement("li");
        var text = document.createTextNode(lead[i].playerName + "  " + Math.round(lead[i].playerSize));
        gameBoard.appendChild(text);
        document.getElementById('lead').appendChild(gameBoard);

    }
}

function nameChoose() {
    var name = document.getElementById("nameInput").value;
    var colour = document.getElementById("colour").value;
    console.log(colour);
    checkbox =  document.getElementById("chatChoose").checked;

    /* skin = document.getElementById("slect").value;
    if(skin == 'random'){
        skin = Math.round(Math.random() * ((document.querySelectorAll('option').length - 1) - 1));
    } */
    socket.emit('username', name, checkbox, colour);
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

requestAnimationFrame(main);
