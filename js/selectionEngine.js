var engine = (function(global){
let canvas = $("canvas")[0];
let ctx = canvas.getContext("2d");
ctx.font = "20px Helvetica";
function main(){
	render();
	global.window.requestAnimationFrame(main);
}
function render(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.font = "40px Helvetica";
	ctx.fillText("SELECT YOUR PLAYER",30,87*2);
	ctx.font = "20px Helvetica";
	selector.render();
	for(let icon of iconArray){
		icon.render();
	}
	for(let tag of tags){
		if(selector.col===tag.col){
			tag.render();
		}
	}
	ctx.font = "35px Helvetica";
	ctx.fillText("PRESS ENTER TO SELECT",30,93*6);
}
function init(){
	main();
}
Resources.load([
	"images/char-boy.png",
	"images/char-cat-girl.png",
	"images/char-horn-girl.png",
	"images/char-pink-girl.png",
	"images/char-princess-girl.png",
	"images/Selector.png"
	]);
Resources.onReady(init);
global.ctx = ctx;
})(this);