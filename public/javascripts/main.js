var socket = io(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    map = [],
    squares = [],
    square = {direction: null, velocity: 1, lastmove: 1},
    color = "",
    loaded = false,
    id = "",
    animLoopHandle,
    fps,
    lastCalledTime;

var camera = {
    x: 0,
    y: 0,
    screen: {
        x: window.innerWidth,
        y: window.innerHeight
    }
};

socket.on('data', function(data) {
    color = data.color;
    map = data.map;
    squares = data.squares;
    id = data.id;
    loaded = true;
    if (!animLoopHandle) {
        animloop();
    }
});

socket.on('map', function(data) {
    map = data;
});

socket.on('squares', function(data) {
    camera.x = data[id].position.x - (camera.screen.x / 2);
    camera.y = data[id].position.y - (camera.screen.y / 2);
    console.log(camera);
    squares = data;
});

function render() {
    if (loaded) {
        //ctx.translate(camera.x, camera.y);

        requestAnimationFrame(render);
    }
}
function doKeyDown(evt){
    switch (evt.keyCode) {
        case 38:  /* Up arrow was pressed */
            square.direction = "top";
            break;
        case 40:  /* Down arrow was pressed */
            square.direction = "down";
            break;
        case 37:  /* Left arrow was pressed */
            square.direction = "left";
            break;
        case 39:  /* Right arrow was pressed */
            square.direction = "right";
            break;
    }
    socket.emit('direction', {direction: square.direction});
}

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', doKeyDown, true);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.screen = {
        x: window.innerWidth,
        y: window.innerHeight
    };
}

render();
resizeCanvas();


function animloop() {
    animLoopHandle = window.requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    if(!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    var delta = (new Date().getTime() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(fps, 10, 20);
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map.length; j++) {
            if (map[i][j].type == "square") {
                ctx.beginPath();
                ctx.rect(j * 101 - camera.x, i * 101 - camera.y, 101, 101);
                ctx.fillStyle = map[i][j].color;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.rect(j * 101 - camera.x, i * 101 - camera.y, 101, 101);
                ctx.fillStyle = map[i][j].color;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
        }
    }
    for (var asquare in squares) {
        if(squares.hasOwnProperty(asquare)) {
            ctx.beginPath();
            ctx.rect(squares[asquare].position.x - 20 - camera.x, squares[asquare].position.y - 20 - camera.y, 41, 41);
            ctx.fillStyle = squares[asquare].color;
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}