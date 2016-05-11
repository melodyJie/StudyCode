var balls = [];
var type="source-over";
window.onload = function() {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext('2d')) {
            var ctx = canvas.getContext('2d');
        }
        var num = 100;
        setBalls(canvas, num);

        var timer = null;
        timer = setInterval(
            function() {
                drawBall(ctx);
                updateBall(ctx);
            },
            10
        )
        var btn = document.getElementsByTagName('a');
        for (var i = 0; i < btn.length; i++) {
            btn[i].onclick = function() {
                type= this.innerHTML;
                console.log(type);
            }
        }
    }
    //初始化小球
function setBalls(can, /*option*/ num) {
    if (!num) {
        num = 100;
    }
    for (var i = 0; i < num; i++) {
        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);
        var radius = Math.random() * 50 + 10;
        ball = {
            color: "rgb(" + R + "," + G + "," + B + ")",
            radius: radius,
            x: Math.random() * (can.width - 2 * radius) + radius,
            y: Math.random() * (can.height - 2 * radius) + radius,
            vx: (Math.random() * 2 + 1) * Math.pow(-1, Math.floor(Math.random() * 1000)),
            vy: (Math.random() * 2 + 1) * Math.pow(-1, Math.floor(Math.random() * 1000)),
        }
        balls.push(ball);
    }
    //console.log(balls.length);
}
//描绘小球
function drawBall(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save();
    ctx.globalCompositeOperation=type;
    for (var i = 0; i < balls.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = balls[i].color;
        ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.restore();
}

//更新小球的属性
function updateBall(ctx) {
    var can = ctx.canvas;
    ctx.save();
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;

        if (balls[i].x <= balls[i].radius) {
            balls[i].x = balls[i].radius;
            balls[i].vx = -balls[i].vx;
        } else if (balls[i].x + balls[i].radius >= can.width) {
            balls[i].x = can.width - balls[i].radius;
            balls[i].vx = -balls[i].vx;
        }

        if (balls[i].y <= balls[i].radius) {
            balls[i].y = balls[i].radius;
            balls[i].vy = -balls[i].vy;
        } else if (balls[i].y + balls[i].radius >= can.height) {
            balls[i].y = can.height - balls[i].radius;
            balls[i].vy = -balls[i].vy;
        }

    }

    ctx.restore();
}
