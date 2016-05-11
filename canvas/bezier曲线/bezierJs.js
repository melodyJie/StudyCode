window.onload = function() {
    //初始变量
    var canvas, ctx, point, style, drag = null;

    canvas = document.getElementById('canvas');
    if (canvas.getContext('2d')) {
        ctx = canvas.getContext('2d');
        Init(canvas.className == "quadratic");
    } else {
        console.log("error:No canvas.getContext('2d')");
    }

    function Init(quadratic) {
        point = {
            p1: { x: 100, y: 400 },
            p2: { x: 400, y: 400 }
        }

        if (quadratic) {
            point.cp1={ x: 100, y: 100 }
        } else {
            point.cp1= { x: 100, y: 100 },
                point.cp2= { x: 400, y: 100 }
        }
        style = {
            curve: { width: 6, color: "#333" },
            line: { width: 1, color: "#c00" },
            point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)" }
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        //添加事件
        canvas.onmousedown=drawBegin;
        //canvas.onmousemove=drawwing;  //只在成功时才添加
        canvas.onmouseup=drawEnd;


        Draw();
    }

    function Draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        //draw line
        //line style
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = style.line.color;
        ctx.lineWidth = style.line.width;

        ctx.moveTo(point.p1.x, point.p1.y);
        ctx.lineTo(point.cp1.x, point.cp1.y);
        if (point.cp2) {
            ctx.moveTo(point.p2.x,point.p2.y);
            ctx.lineTo(point.cp2.x,point.cp2.y);
        }else{
            ctx.lineTo(point.p2.x,point.p2.y);
        }
        ctx.stroke();
        ctx.restore();

        //draw point
        ctx.save();
        //point style
        ctx.strokeStyle=style.point.color;
        ctx.fillStyle=style.point.fill;
        ctx.lineWidth=style.point.width;
        
        for(var p in point){
            ctx.beginPath();
            ctx.arc(point[p].x,point[p].y,style.point.radius,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();

        //draw curve
        ctx.save();
        ctx.beginPath();
        //curve style
        ctx.strokeStyle=style.curve.color;
        ctx.lineWidth=style.curve.width;

        ctx.moveTo(point.p1.x,point.p1.y);
        if(point.cp2){
            ctx.bezierCurveTo(point.cp1.x,point.cp1.y,point.cp2.x,point.cp2.y,point.p2.x,point.p2.y);
        }else{
            ctx.quadraticCurveTo(point.cp1.x,point.cp1.y,point.cp2.x,point.cp2.y,point.p2.x,point.p2.y);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawBegin(e){
        e=mousePos(e);
        console.log(e);
        var dx,dy;
        for (var p in point) {
            dx = point[p].x - e.x;
            dy = point[p].y - e.y;
            if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
                drag = p;
                canvas.onmousemove=drawwing;  //只在成功时才添加
                dPoint = e;
                canvas.style.cursor = "move";
                return;
            }
        }
    }

    function drawwing(e){
        if (drag) {
            e = mousePos(e);
            point[drag].x += e.x - dPoint.x;
            point[drag].y += e.y - dPoint.y;
            dPoint = e;
            Draw();
        }
    }

    function drawEnd(e){
        canvas.onmousemove=null;
        drag=null;
        canvas.style.cursor="default";
    }

    //获取坐标值
    function mousePos(e){
        e = e||window.event;
        return {
            x: e.pageX - canvas.offsetLeft,
            y: e.pageY - canvas.offsetTop
        }
    }
}
