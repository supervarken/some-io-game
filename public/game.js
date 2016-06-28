var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
TO_RADIANS = Math.PI/180;
var players = [];
var foods = [];
var powers = [];
var mines = [];
var direction = {
    x: 0,
    y: 0
};
var walls = [];
var mines = [];
var bullets = [];
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
"http://pbs.twimg.com/profile_images/693492259791200256/z0oxKdVO.png",
"http://www.lunapic.com/editor/premade/transparent.gif",
"http://i.imgur.com/9gWLFFH.png",
"http://www.nssmag.com/assets/extensions/labs/sites/bbhmm/images/powerup-2.png",
"http://www.nssmag.com/assets/extensions/labs/sites/bbhmm/images/powerup-4.png",
"http://www.sireasgallery.com/iconset/minesweeper/Mine_256x256_32.png",
"http://findicons.com/files/icons/2799/flat_icons/256/trophy.png",
"http://bestdesignoptions.com/wp-content/uploads/2009/06/grass-texture-10.png",
"http://orig01.deviantart.net/6cc2/f/2011/361/e/0/seamless_ground_texture_by_lauris71-d4kd616.png",
"http://simpleicon.com/wp-content/uploads/football.png",
"", //http://downloadicons.net/sites/default/files/crown-symbol-64788.png
"http://i4.istockimg.com/file_thumbview_approve/77377365/5/stock-photo-77377365-seamless-dark-green-grass-digital-texture.jpg",
"http://cdn1.iconfinder.com/data/icons/round-arrows/256/up158-128.png");
//backColour = "#FFFFFF";


canvas.addEventListener('mousedown', function(e) { e.preventDefault(); document.getElementById("m").blur(); socket.emit('shot');}, false);

function updateTransform() {
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -(camera.x - camera.width * 0.5) * camera.zoom, -(camera.y - camera.height * 0.5) * camera.zoom);
}

function updateCamera(player) {
    camera.x = player.x;
    camera.y = player.y;

    camera.height = canvas.height;
    camera.width = canvas.width;
}

var main = function() {

    var now = Date.now();
    var delta = now - then;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    render();

    fps = 1000 / delta;

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
    var r = 0;
    if (document.activeElement.tagName != "INPUT") {
        if (keys[87] || keys[38]) {
            x += -1;
        }
        if (keys[83] || keys[40]) {
            x += 1;
        }
        if (keys[68] || keys[39]) {
            r += 1;
        }
        if (keys[65] || keys[37]) {
            r += -1;
        }
         if (keys[32]) {
            socket.emit('emitBomb');
        }
        if (keys[84]) {
            socket.emit('shot');
        }
        if (direction.x != x || direction.y != y || direction.r != r) {
            direction = {
                x: x,
                y: y,
                r: r
            };
            socket.emit('changeDirection', direction);
        }

    }
}

function howToPlay() {
    if (document.getElementById('howto').style.display == 'none') {
            document.getElementById('howto').style.display = 'block';
    }
            else {
                document.getElementById('howto').style.display = 'none';
            }
}
function nameChoose() {
    var name = document.getElementById("nameInput").value;
    var colour = document.getElementById("colour").value;
    checkbox =  document.getElementById("chatChoose").checked;

    /* skin = document.getElementById("slect").value;
    if(skin == 'random'){
        skin = Math.round(Math.random() * ((document.querySelectorAll('option').length - 1) - 1));
    } */
    socket.emit('username', name, checkbox, colour);
}

 function drawRotatedImage(image, x, y, angle) {

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle) * TO_RADIANS);
  ctx.drawImage(images[9], -(image.playerSize * 1.15), -(image.playerSize * 1.15),  image.playerSize * 2.3, image.playerSize * 2.3);
  ctx.fillStyle = image.colour;

  //ctx.fillRect(-image.playerSize * 1.5, -image.playerSize * 0.3, image.playerSize * 0.5, image.playerSize * 0.5);
     xr = -2 * image.playerSize; yr = 0;
   ctx.beginPath();
    ctx.moveTo(xr,-0.015 * player.playerSize);
    ctx.lineTo(xr+0.3*player.playerSize,0.3 * player.playerSize);
    ctx.lineTo(xr+0.3*player.playerSize,-0.3*player.playerSize);
     ctx.lineTo(xr,0.015 * player.playerSize);
    ctx.fill();
     ctx.lineWidth = 0.05 * player.playerSize;
      ctx.strokeStyle = 'black';
      ctx.stroke();
     ctx.closePath();
  ctx.restore();
 }

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

requestAnimationFrame(main);
