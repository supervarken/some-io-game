
function render() {

   var playerme = {x: width / 2, y: height / 2, playerSize: 10000};

    for(i in players) {
        var p = players[i];
        if(p.me) {
            playerme = p;
            break;
        }
    }

    clientMove(playerme);

    bulletsMove();

    ctx.font = 20 / camera.zoom + "px Arial";
    ctx.fillStyle = "#734A12";
   ctx.fillStyle = "#5E5E5E";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    updateCamera(playerme);
    updateTransform();

     ctx.fillStyle = ctx.createPattern(images[7], "repeat");
   if(!backColour == 0){
       ctx.fillStyle = backColour;
   }
     ctx.fillRect(0, 0, width, height);
     ctx.lineWidth = 20;
      ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, width, height);

    ctx.fill();
    //ctx.drawImage(back, 0, 0, 1500, 1000);
    for (i = 0; i < foods.length; i++) {
        var food = foods[i];

        ctx.fillStyle = food.foodcolor;
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.playerSize, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);
    }


    for (i = 0; i < powers.length; i++) {
       var  power = powers[i];
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(power.x, power.y, power.playerSize, 0, 2 * Math.PI, false);
         ctx.fill();
        ctx.closePath();
        ctx.drawImage(images[power.img], power.x - (0.5 * power.playerSize), power.y - (0.5 * power.playerSize), power.playerSize, power.playerSize);


        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }
     for (i = 0; i < mines.length; i++) {

        mine = mines[i];
        ctx.drawImage(images[5], mine.x - (0.5 * mine.playerSize), mine.y - (0.5 * mine.playerSize), mine.playerSize, mine.playerSize);
        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }
for (i = 0; i < walls.length; i++) {

    ctx.fillRect(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
    }
for (i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
      ctx.fillStyle = bullet.colour;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.playerSize, 0, 2 * Math.PI, false);
         ctx.fill();
         ctx.closePath();
    }

    ctx.fillStyle = "#000000";

    for (i in players) {

        player = players[i];
       ctx.beginPath();
        ctx.fillStyle = player.skin;
        ctx.arc(player.x, player.y, player.playerSize, 0, (2 * Math.PI), false);
          ctx.fill();
        ctx.closePath();
          drawRotatedImage(player,player.x, player.y,player.r);
     //   ctx.drawImage(images[9], player.x - (1.15 * player.playerSize), player.y - (1.15 * player.playerSize), player.playerSize * 2.3, player.playerSize * 2.3);

if (images[player.skin]){
        ctx.drawImage(images[player.skin], player.x - (0.5 * player.playerSize), player.y - (0.5 * player.playerSize), player.playerSize, player.playerSize);
}
      ctx.fillStyle = "#000000";
        var koala = player.playerName.length;
        ctx.fillText(player.playerName, player.x - (koala * 3.5) / camera.zoom, player.y - (player.playerSize * 1.2));
        for(i = 0; i < player.flairs.length; i++){
            ctx.drawImage(images[player.flairs[i]], player.x - (3.5 * koala) - (11 * i) - 15, player.y - 10 - (player.playerSize * 1.2), 10, 10);
        }

    }
    ctx.setTransform(1,0,0,1,0,1);

     if(playerme.me){
        ctx.fillStyle = playerme.skin;
        ctx.arc(40, 40, 40, 0, (2 * Math.PI), false);
          ctx.fill();
      ctx.fillStyle = "#000000";
          ctx.font = "bold 15px Dax Regular";
    ctx.fillText("My Score: ",10, 30);
ctx.fillText(Math.round(playerme.playerSize * 10),25, 50);
ctx.fillText("FPS: " + Math.round(fps), 15,70);


var mapw = width / 50 + 1.5;
var maph = height / 50 + 1.5;
var x = 5;
var y = canvas.height - maph - 5;
ctx.globalAlpha = 0.5;
ctx.fillRect(x, y, mapw, maph);
ctx.globalAlpha = 1;
for (var i = 0; i < players.length; i++){
    ctx.fillStyle = "#0000FF";
    play = players[i];
    if(play.me){
        ctx.fillStyle = "#ffffff";
    }

   ctx.fillRect(x + play.x / (maph / 2),y + play.y / (mapw / 2), 3 , 3);
}

}

};

