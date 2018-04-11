
/*
Player Selection Engine.
*/

var engine = (function(global){

let canvas = $("canvas")[0];							// Select the Selection screen canvas element

let ctx = canvas.getContext("2d");						// Set its context to 2D

ctx.font = "20px Helvetica";							// Set the font of the Canvas


/*
Main function ones called is called again and again to refresh the Frames
of the game , which is achieved by requestAnimationFrame() function.
*/


function main(){
	render(); 											// Render the objects in the frame on the canvas
	global.window.requestAnimationFrame(main);			// Call for the next frame.
}

function render(){
	ctx.clearRect(0,0,canvas.width,canvas.height);		// Clears the previous frame
	ctx.font = "40px Helvetica";						// Set new font
	ctx.fillText("SELECT YOUR PLAYER",30,87*2);			// Display Text Over the canvas
	ctx.font = "20px Helvetica";						// Reset the font
	selector.render();									// Render the Selector icon
	for(let icon of iconArray){							// Render all the Player icons
		icon.render();
	}
	for(let tag of tags){								// Render all the Improvised names of the players.
		if(selector.col===tag.col){
			tag.render();
		}
	}
	ctx.font = "35px Helvetica";						// Reset the font.
	ctx.fillText("PRESS ENTER TO SELECT",30,93*6);		// Display Text over the canvas
}

function init(){										// Function which further calls the main() function when all the visual resources are loaded.
	main();
}
Resources.load([										// Load all the visual resources we need current canvas
	"images/char-boy.png",
	"images/char-cat-girl.png",
	"images/char-horn-girl.png",
	"images/char-pink-girl.png",
	"images/char-princess-girl.png",
	"images/Selector.png"
	]);
Resources.onReady(init);								// calls init() function ones all the resources are loaded.
global.ctx = ctx;										// change the global context to present context.
})(this);