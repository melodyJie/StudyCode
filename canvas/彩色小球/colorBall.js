window.onload=function(){
	var canvas= document.getElementById('canvas');
	if(canvas.getContext('2d')){
		var ctx=canvas.getContext('2d');
	}

	var num=100;

	//globalAlpha 影响全局透明度
	ctx.globalAlpha=0.7;
	for(var i=0;i<num;i++){
		var R=Math.floor(Math.random()*255);
		var G=Math.floor(Math.random()*255);
		var B=Math.floor(Math.random()*255);
		var A=Math.random();
		//ctx.strokeStyle="rgb("+R+","+G+","+B+")";
		//ctx.fillStyle="rgba("+R+","+G+","+B+","+Math.random()+")";
		ctx.fillStyle="rgb("+R+","+G+","+B+")";

		ctx.beginPath();
		ctx.arc(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*60,0,Math.PI*2);
		ctx.fill();
		//ctx.stroke();

	}

	//下面证明  globalAlpha  能影响 strokeStyle  的透明度
	/*ctx.globalAlpha=0.1;
	var R=Math.floor(Math.random()*255);
		var G=Math.floor(Math.random()*255);
		var B=Math.floor(Math.random()*255);
	ctx.strokeStyle="rgb("+R+","+G+","+B+")";
	ctx.moveTo(100,100);
	ctx.lineTo(500,500);
	ctx.lineWidth=20;
	ctx.stroke();

	R=Math.floor(Math.random()*255);
	G=Math.floor(Math.random()*255);
	B=Math.floor(Math.random()*255);

	ctx.beginPath();
	ctx.moveTo(500,100);
	ctx.lineTo(100,500);
	ctx.strokeStyle="rgb("+R+","+G+","+B+")";
	ctx.stroke();*/
}