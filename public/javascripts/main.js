var socket = io(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    map = [],
    squares = [],
    square = {direction: null, velocity: 1, lastmove: 1},
    color = "",
    loaded = false;

socket.on('data', function(data) {
    color = data.color;
    map = data.map;
    squares = data.squares;
    loaded = true;
});

socket.on('map', function(data) {
    map = data;
});

socket.on('squares', function(data) {
    squares = data;
});

function render() {
    if(loaded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map.length; j++) {
                if (map[i][j].type == "square") {
                    ctx.beginPath();
                    ctx.rect(j * 101, i * 101, 101, 101);
                    ctx.fillStyle = map[i][j].color;
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.rect(j * 101, i * 101, 101, 101);
                    ctx.fillStyle = map[i][j].color;
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                }
            }
        }
        if (square.lastmove == square.velocity) {
            square.lastmove = 1;
            if (square.direction != null) {
                socket.emit('move', {direction: square.direction});
            }
        } else {
            square.lastmove++;
        }
        for (var asquare in squares) {
            ctx.beginPath();
            ctx.rect(squares[asquare].position.x -50, squares[asquare].position.y -50, 101, 101);
            ctx.fillStyle = squares[asquare].color;
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
    requestAnimationFrame(render);
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
}

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', doKeyDown, true);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

render();
resizeCanvas();
//var interval = setInterval(function() {if(square.direction != null) {socket.emit('move', {direction: square.direction})}}, 250);