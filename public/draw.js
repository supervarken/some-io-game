
function render() {

   playerme = {x: width / 2, y: height / 2};

    for(i in players) {
        var p = players[i];
        if(p.me) {
            playerme = p;
            break;
        }
    }

    if(playerme === undefined) {
        console.log("dd");


    }

    ctx.setTransform(1,0,0,1,0,1);

    ctx.font = 0.4 * playerme.playerSize + "px Arial";
    ctx.fillStyle = "#734A12";
   ctx.fillStyle = ctx.createPattern(images[8], "repeat");
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
for (i = 0; i < walls.length; i++) {

    ctx.fillRect(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
    }

for (i = 0; i < bullets.length; i++) {
      ctx.fillStyle = bullets[i].colour;
        ctx.beginPath();
        ctx.arc(bullets[i].x, bullets[i].y, bullets[i].playerSize, 0, 2 * Math.PI, false);
         ctx.fill();
    }
    ctx.fillStyle = "#000000";

    for (i in players) {

        player = players[i];
       ctx.beginPath();
        ctx.fillStyle = player.skin;
        ctx.arc(player.x, player.y, player.playerSize, 0, (2 * Math.PI), false);
          ctx.fill();
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
     if(playerme.me){
var wave = 50 / camera.zoom;
        ctx.fillStyle = playerme.skin;
        ctx.arc(playerme.x - (canvas.width / 2) / camera.zoom + wave, playerme.y - (canvas.height / 2) / camera.zoom + wave, wave, 0, (2 * Math.PI), false);
          ctx.fill();
      ctx.fillStyle = "#000000";
          ctx.font = "bold " + 20 / camera.zoom + "px Dax Regular";
    ctx.fillText("My Score: ",playerme.x - (canvas.width / 2) / camera.zoom + (10 / camera.zoom), playerme.y - (canvas.height / 2) / camera.zoom + (45 / camera.zoom));
ctx.fillText(Math.round(playerme.playerSize * 10),playerme.x - (canvas.width / 2) / camera.zoom + (35 / camera.zoom), playerme.y - (canvas.height / 2) / camera.zoom + (70 / camera.zoom));
ctx.fillText("FPS: " + fps.toFixed(2),playerme.x - (canvas.width / 2) / camera.zoom + (20 / camera.zoom), playerme.y - (canvas.height / 2) / camera.zoom + (90 / camera.zoom));

ctx.globalAlpha = 0.5;
cz = camera.zoom
mapx = playerme.x + 2 - (canvas.width / 2) / camera.zoom;
mapy = playerme.y - 2 + (canvas.height / 2) / camera.zoom - (height/50) / camera.zoom;
mapw = (width / 50) / camera.zoom;
maph = (height / 50) / camera.zoom;
ctx.fillRect(mapx, mapy, mapw + 1.5/ cz, maph + 1.5/ cz );

         ctx.globalAlpha = 1;

for (var i = 0; i < players.length; i++){
    ctx.fillStyle = "#0000FF";
    play = players[i];
    if(play.me){
        ctx.fillStyle = "#ffffff";
    }

   ctx.fillRect(mapx + (play.x / (width / 100) - 1.5)/ cz, mapy + ((play.y / (height / 200) - 1.5)/ cz),3/ cz, 3 / cz);
}

}


};

