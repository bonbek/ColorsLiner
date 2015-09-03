var socket = io(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    map = [],
    squares = [],
    square = {direction: null, velocity: 2, lastmove: 1},
    color = "",
    loaded = false,
    id = "";

socket.on('data', function(data) {
    color = data.color;
    map = data.map;
    squares = data.squares;
    id = data.id;
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
        /*
        if (square.lastmove == square.velocity) {
            square.lastmove = 1;
            if (square.direction != null) {
                socket.emit('move', {direction: square.direction});
            }
        } else {
            square.lastmove++;
        }*/
        if (square.direction != null) {
            for(i = 1; i < square.velocity; i++) {
                socket.emit('move', {direction: square.direction});
            }
        }
        for (var asquare in squares) {
            ctx.beginPath();
            ctx.rect(squares[asquare].position.x-20, squares[asquare].position.y -20, 41, 41);
            ctx.fillStyle = squares[asquare].color;
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
        ctx.translate(squares[id].position.x, squares[id].position.y);
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