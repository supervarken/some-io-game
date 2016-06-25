
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
     ctx.fillStyle = ctx.createPattern(images[11], "repeat");
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
        ctx.fillText(player.playerName, player.x - (koala * 3.5), player.y - (player.playerSize * 1.2));
        for(i = 0; i < player.flairs.length; i++){
            ctx.drawImage(images[player.flairs[i]], player.x - (3.5 * koala) - (11 * i) - 15, player.y - 10 - (player.playerSize * 1.2), 10, 10);
        }
    }

};