window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.msRequestAnimationFrame     ||
        function( callback ) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelAnimFrame = (function(handle) {
    return  window.cancelAnimationFrame     ||
        window.mozCancelAnimationFrame;
})();