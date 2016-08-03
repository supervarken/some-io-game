
function render() {

   var playerme = {x: width / 2, y: height / 2};

    for(i in players) {
        var p = players[i];
        if(p.me) {
            playerme = p;
            break;
        }
    }

    //clientMove(playerme);

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
    footLines(width, height, 0, 0, 20);
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
              var  power = powers[i];
        if (power.a == undefined){
            power.a = Math.random() * 1000;
        }

        power.a += 0.1;

        //ctx.fillStyle = "rgba(200, 50, 50, " + (Math.sin(power.a) / 4 + 0.5)+ ")";

        ctx.beginPath();
        ctx.fillStyle = "rgba(200, 100, 20, 1)"
        ctx.arc(power.x, power.y, power.playerSize/1, 0, 2 * Math.PI, false);
        ctx.fill();

            ctx.strokeStyle = "rgba(0, 0, 0, " + (Math.sin(power.a) / 8 + 0.125)+ ")";
        ctx.lineWidth = 10;
        ctx.stroke();


         ctx.beginPath();
           ctx.fillStyle = "rgba(255, 20, 20, 1)";
        ctx.arc(power.x, power.y, power.playerSize/1.3, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "rgba(0, 0, 0, " + (Math.sin(power.a) / 8 + 0.125)+ ")";

         ctx.beginPath();
         ctx.arc(power.x, power.y, power.playerSize/1.3, 0, 2 * Math.PI, false);
           ctx.fill();
        //ctx.closePath();


        ctx.closePath();
        ctx.drawImage(images[power.img], power.x - (0.5 * power.playerSize), power.y - (0.5 * power.playerSize), power.playerSize, power.playerSize);


    }
     for (i = 0; i < mines.length; i++) {

        mine = mines[i];

        ctx.closePath();
        ctx.drawImage(images[5], mine.x - 15, mine.y - 15, 30, 30);
        //  ctx.fillRect(food.x,food.y,food.playerSize,food.playerSize);

    }

for (i = 0; i < walls.length; i++) {
ctx.fillStyle = "white";
   //ctx.fillRect(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
    ctx.beginPath();
        //ctx.arc(walls[i].x, walls[i].y, walls[i].playerSize, 0, 2 * Math.PI, false);
         ctx.fill();
         ctx.closePath();
    ctx.save();
    walls[i].ang += walls[i].si * (60/fps);
    if (walls[i].ang > 360 || walls[i].ang < -360){
        walls[i].ang = 0;
    }
      ctx.translate(walls[i].x, walls[i].y);
    ctx.rotate(walls[i].ang*Math.PI/180);
    ctx.drawImage(images[13], -100, -100, 200, 200);
    ctx.restore();
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
       // for(i = 0; i < player.flairs.length; i++){
        //    ctx.drawImage(images[player.flairs[i]], player.x - (3.5 * koala) - (11 * i) - 15, player.y - 10 - (player.playerSize * 1.2), 10, 10);
       // }

    }
    ctx.setTransform(1,0,0,1,0,1);

     if(playerme.me){



var mapw = width / 50 + 1.5;
var maph = height / 50 + 1.5;
var x = 5;
var y = 5;
ctx.globalAlpha = 0.5;
ctx.fillRect(x, y, mapw, maph);

ctx.globalAlpha = 1;

footLines(mapw,maph, x, y, 2);
         ctx.fillStyle = "rgba(200,100,100,0.7)";
       ctx.roundRect(5, canvas.height - 185, 70,70,10);
         ctx.fill();
         ctx.stroke();
         if (playerme.pu != 0){
ctx.drawImage(images[playerme.pu], 10, canvas.height - 180, 60, 60);
         }
         else {
             //ctx.drawImage(images[14], 10, canvas.height - 180, 60, 60);
         }
for (var i = 0; i < players.length; i++){
    ctx.fillStyle = "#8899FF";
    play = players[i];

     if(leads[0] && play.playerName === leads[0].playerName){
        ctx.fillStyle = "#FFFF00";
    }
    if(play.me){
        ctx.fillStyle = "#ffffff";
    }

   //ctx.fillRect(x + play.x / (maph / 4),y + play.y / (mapw / 2), play.playerSize / 5, player.playerSize / 5);
  ctx.beginPath();
        ctx.arc(x + play.x / 50, y + play.y / 50, 2 * (play.playerSize / 50), 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

for (var i = 0; i < walls.length; i++){
    ctx.fillStyle = "grey";
    wall = walls[i];

   //ctx.fillRect(x + play.x / (maph / 4),y + play.y / (mapw / 2), play.playerSize / 5, player.playerSize / 5);
  ctx.beginPath();
        ctx.arc(x + wall.x / 50, y + wall.y / 50, 1 * (wall.playerSize / 50), 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}


var x = 5;
var y = canvas.height + 20;
         ctx.font = "bold 15px Dax Regular";
ctx.fillStyle = "#FFFFFF";
ctx.fillText(playerme.playerName,x, y-100);
ctx.fillText("Score: " + Math.round(playerme.playerSize * 10),x, y-80);
ctx.fillText("FPS: " + Math.round(fps), x,y-60);
for (var i = 0; i < leads.length; i++){
    if (leads[i].playerName == playerme.playerName){
        rank = i + 1;
    }
}
ctx.fillText("Ranking: " + rank + "/" + leads.length, x,y-40);
}


//var w = canvas.width / 4;
var w = 300;
var x = canvas.width - w - 5;
var y = 5;
var l = canvas.width - 80;
ctx.lineWidth = 5;
var sb = Math.min(leads.length, 5);
ctx.fillStyle = "#a4c1ba";
ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
ctx.roundRect(x, y, w, 35 + sb * 34, 10).stroke();
ctx.fillStyle = "#0a0d0f";
ctx.roundRect(x, y, w, 35 + sb * 34, 10).fill();
ctx.font = "25px scoreboard";
ctx.fillStyle = "#FFFFFF";


var y = y + 35;
ctx.fillText("ScoreBoard",x + 80, y);
ctx.fillStyle = "red";

for (i = 0; i < leads.length && i < 5; i++){
var q = i + 1;
ctx.fillText(q + ".",x + 15, y + 32 * q);
ctx.fillText(leads[i].playerName,x + 60, y + 32 * q);

ctx.fillText(Math.round(leads[i].playerSize * 10),l, y + 32 * q);
}

};

function footLines(width, height, x, y, l){

     ctx.lineWidth = l;
      ctx.strokeStyle = 'white';
    ctx.strokeRect(x, y, width, height);


      ctx.beginPath();
        ctx.arc(x + width / 2,y + height / 2, width/8, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
ctx.moveTo(x,y +height/2);
ctx.lineTo(x + width,y +height/2);
ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(x + 3*width/8,y);
ctx.lineTo(x + 3*width/8,y + height/16);
ctx.lineTo(x+5*width/8,y+height/16);
ctx.lineTo(x+5*width/8,y);
ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(x+3*width/8,y+height);
ctx.lineTo(x+3*width/8,y+height - height/16);
ctx.lineTo(x+5*width/8,y+height - height/16);
ctx.lineTo(x+5*width/8,y+height);
ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(x+0,y+height/2);
ctx.lineTo(x+width,y+height/2);
ctx.closePath();
ctx.stroke();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}
