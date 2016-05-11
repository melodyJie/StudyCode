var CANWIDTH=1000;
var CANHEIGHT=800;
var XSTART=50;
var YSTART=50;
var Radius=7;

var endTime=new Date();
endTime.setDate(endTime.getDate()+1);
var curShowTime=0;

var balls=[];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload=function(){
	CANWIDTH=document.body.clientWidth||document.documentElement.clientWidth;
	CANHEIGHT=document.body.clientHeight||document.documentElement.clientHeight;
	XSTART = Math.round(CANWIDTH /10);
    YSTART = Math.round(CANHEIGHT /5);
    Radius = Math.round(CANWIDTH * 4 / 5 / 108)-1


	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	canvas.width=CANWIDTH;
	canvas.height=CANHEIGHT;
	curShowTime=getCurShowTime();
		
	
	setInterval(
		function(){
			render(context);
			update();		
		},
		50
	);
}
//获取当前要展示的时间 
function getCurShowTime(){
	var curTime=new Date();
	var ret = endTime.getTime()-curTime.getTime();
	ret=Math.round(ret/1000);
	return ret>0?ret:0;
}

function update(){
	var nextShowTime=getCurShowTime();

	var nextHours=parseInt(nextShowTime/3600);
	var nextMinutes=parseInt((nextShowTime-nextHours*3600)/60);
	var nextSeconds=nextShowTime%60;

	var curHours=parseInt(curShowTime/3600);
	var curMinutes=parseInt((curShowTime-curHours*3600)/60);
	var curSeconds=curShowTime%60;

	if(nextSeconds!=curSeconds){		
		if(parseInt(nextHours/10)!=parseInt(curHours/10)){
			addBall(XSTART,YSTART,parseInt(nextHours/10));
		}
		if(parseInt(nextHours%10)!=parseInt(curHours%10)){
			addBall(XSTART+15*(Radius+1),YSTART,parseInt(curHours%10));
		}

		if(parseInt(nextMinutes/10)!=parseInt(curMinutes/10)){
			addBall(XSTART+39*(Radius+1),YSTART,parseInt(curMinutes/10));
		}
		if(parseInt(nextMinutes%10)!=parseInt(curMinutes%10)){
			addBall(XSTART+54*(Radius+1),YSTART,parseInt(curMinutes%10));
		}

		if(parseInt(nextSeconds/10)!=parseInt(curSeconds/10)){
			addBall(XSTART+78*(Radius+1),YSTART,parseInt(curSeconds/10));
		}
		if(parseInt(nextSeconds%10)!=parseInt(curSeconds%10)){
			addBall(XSTART+93*(Radius+1),YSTART,parseInt(curSeconds%10));
		}
		curShowTime =nextShowTime;
	}
	updateBalls();
	//console.log(balls.length); //测试
}

function render(cxt){
	cxt.clearRect(0,0,CANWIDTH,CANHEIGHT);
	
	var hours=parseInt(curShowTime/3600);
	var minutes=parseInt((curShowTime-hours*3600)/60);
	var seconds=curShowTime%60;
	
	renderDigit(XSTART,YSTART,parseInt(hours/10),cxt);
	renderDigit(XSTART+15*(Radius+1),YSTART,parseInt(hours%10),cxt);

	renderDigit(XSTART+30*(Radius+1),YSTART,10,cxt);	

	renderDigit(XSTART+39*(Radius+1),YSTART,parseInt(minutes/10),cxt);
	renderDigit(XSTART+54*(Radius+1),YSTART,parseInt(minutes%10),cxt);

	renderDigit(XSTART+69*(Radius+1),YSTART,10,cxt);

	renderDigit(XSTART+78*(Radius+1),YSTART,parseInt(seconds/10),cxt);
	renderDigit(XSTART+93*(Radius+1),YSTART,parseInt(seconds%10),cxt);

	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,Radius,0,2*Math.PI,true)
		cxt.closePath();
		cxt.fill();
	}
}

function renderDigit(x,y,num,cxt){
	cxt.fillStyle="rgb(0,102,153)";
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+2*j*(Radius+1)+Radius+1,y+2*i*(Radius+1)+Radius+1,Radius,0,2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}

function addBall(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var aball={
					x:x+2*j*(Radius+1)+Radius+1,
					y:y+2*i*(Radius+1)+Radius+1,
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.floor(Math.random()*1000))*(2*Math.random()+3),
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aball);
			}
		}
	}
}

function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		

		if(balls[i].y>=CANHEIGHT-Radius){
			balls[i].y=CANHEIGHT-Radius;
			//处理小球不能停止的方法:原因:碰撞后,上升下降过程中多获得了一次加速度的作用(浮点数的影响),减去即可
			//同时还要保证减去的后速度 不能为正值
			balls[i].vy=Math.ceil(-balls[i].vy*0.75)+balls[i].g<0?Math.ceil(-balls[i].vy*0.75)+balls[i].g:0;
			//数据测试
			/*if(i==0){
				console.log("---:"+balls[i].vy);
			}*/
			
			
		}else{  //碰撞只改变速度方向,不改变大小
			balls[i].vy+=balls[i].g;
		}
		//数据测试
		/*if(i==0){
				console.log("+:"+balls[i].vy);
		}*/
		
	}
	var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + Radius > 0 && balls[i].x -Radius < CANWIDTH )
            balls[cnt++] = balls[i]

    while( balls.length > cnt ){
        balls.pop();
    }
}