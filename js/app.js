
let level = 1, best=0,score=0;
let norepeat =[];
let life1 = "<img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\">";
let life2 = "<img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\"><img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\">";
let life3 = "<img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\"><img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\"><img src=\"images/Heart.png\" width=\"20px\" height=\"30px\" alt=\"Life\">";
let lifenumber=0;
let selected = false;
let sound = true;
let game_start=false;

$("#music")[0].volume=0.2;

$("#help_reveal").on("click",function(){
    $("#written-material").toggleClass("hide");
    $(".keybinds").toggleClass("hide");
    if($("#written-material").css("display")==="none"){
        $("#help_reveal")[0].innerText = "Click here To Know About Game";
    }
    else $("#help_reveal")[0].innerText = "Click here To Know KeyBinds";
});

$("#mus").on("click",function(){
    if($("#music")[0].paused===false){
        $("#music")[0].pause();
        $(".controls")[0].src="images/no-music.png";
    }
    else {
        $("#music")[0].play();
        $(".controls")[0].src="images/music.png";
    }
});

$("#sou").on("click",function(){
    if(sound===true){
        $("#move-selector")[0].muted=true;
        $("#move-ingame")[0].muted=true;
        $("#collide")[0].muted=true;
        $("#complete")[0].muted=true;
        $("#collect")[0].muted=true;
        $("#enter")[0].muted=true;
        $(".controls")[1].src="images/no-sound.png";
    }
    else {
        $("#move-selector")[0].muted=false;
        $("#move-ingame")[0].muted=false;
        $("#collide")[0].muted=false;
        $("#complete")[0].muted=false;
        $("#collect")[0].muted=false;
        $("#enter")[0].muted=false;
        $(".controls")[1].src="images/sound.png";
    }
});


let generator = function(row,col){
    this.row = row;
    this.col = col;
}

// Function to Generate Random Numbers Between two numbers Maximum and Minimum
var Randoms = function(max,min){
    let result = Math.random()*(max-min+1); // This Generates numbers between 0 to max-min+1
    result = Math.floor(result); // This generates whole numbers
    result = result + min; // This adds Lower limit to the result
    return result; // function returns the required value
}

var strictRandom = function(rmax,rmin,cmax,cmin){
        let pos = new generator();
    while(1){
        let found=false;
        const tempr = Randoms(rmax,rmin);
        const tempc = Randoms(cmax,cmin);
        if(norepeat.length===0){
            pos.col = tempc;
            pos.row = tempr;
            norepeat.push(pos);
            break;
        }
        else{
            for(let number of norepeat){
                if(number.row===tempr&&number.col===tempc){
                    found=true;
                }
            }
            if(found===false){
                pos.col = tempc;
                pos.row = tempr;
                norepeat.push(pos);
                break;
            }
        }
    }
    return pos;
}


// Enemies our player must avoid
class Enemy{
    constructor(){
    this.reset();
    this.col; // This takes control of column of enemy
    this.row; // This takes control of row of enemy
    this.speed; //This takes control of speed of enemy
    this.x; // This takes control of x-position of enemy
    this.y; // This takes control of y-position of enemy
    this.sprite = 'images/enemy-bug.png'; //This takes control of the image of enemy
}

update(){
    this.x = this.x + this.speed; // updates the speed of movement of the
    this.y = this.row*83;
    if(this.x>6*83){   // If Reached at the end of Canvas , Restart.
        this.reset();
    }
}

render(){
     ctx2.drawImage(Resources.get(this.sprite), this.x, this.y);
}

reset(){
    this.col = -1; // Send it 1 coloumn behind the canvas
    this.row = Randoms(3,1); // Set Any 1 Row out of three.
    this.x = this.col*101; // Set the x-position according to column.
    this.y = this.row*83; // Set the y position according to Row
    this.speed = Randoms(6,2);// Set the speed of the enemies.
}

}


class players {
    constructor(){
        this.x;
        this.y;
        this.row;
        this.col;
        this.sprite;
        this.reset();
    }

    // Check this later.
    update(){
        if(this.row!=-1){
        this.x = 101*this.col;
        this.y = 87*this.row;
        }
    }
    // Function to render the position of player on screen
    render(){
        ctx2.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // Function to reset the position od player
    reset(){
        this.row = 5; // Player is Reset to Grass
        this.col = Randoms(3,1); // Player is on any of the 1,2,3 row
        this.x = this.row*87; // Set X- Axis position accordingly.
        this.y = this.col*101; // Set Y-Position Accordingly.
    }
    // Function to update position of player on keypresses
    handleInput(key){
        let change;
        //Insert Sound of movement

        if(key==="left"){
            $("#move-ingame")[0].play();
            this.col--;
            change="colminus";
        }
        else if(key==="right"){
            $("#move-ingame")[0].play();
            this.col++;
            change="colplus";
        }
        else if(key==="up"){
            $("#move-ingame")[0].play();
            this.row--;
            change="rowminus";
        }
        else if(key==="down"){
            $("#move-ingame")[0].play();
            this.row++;
            change="rowplus";
        }
        if(addon_array[4].row===this.row&&addon_array[4].col===this.col){
            if(change==="colminus")this.col++;
            if(change==="colplus")this.col--;
            if(change==="rowminus")this.row++;
            if(change==="rowplus")this.row--;
        }
        // For Handling Illegal moves which will try to push player out of canvas
        if(this.col<0){
            this.col=0;
        }
        if(this.row===6){
            this.row=5;
        }
        if(this.col>4){
            this.col=4;
        }
        if(this.row===-1){
            this.row=0;
        }
    }
}

class collectibles {
    constructor(name,sprite,points){
        this.name = name;
        this.points = points;
        let rcCombo = strictRandom(3,1,4,0);
        this.row = rcCombo.row;
        this.col = rcCombo.col;
        this.sprite = sprite;
        this.x = this.col*101;
        this.y = this.row*83;
        this.collected = false;
    }

    render(){
        ctx2.drawImage(Resources.get(this.sprite),this.x,this.y);
    }

    reset(){
        let rcCombo = strictRandom(3,1,4,0);
        this.row = rcCombo.row;
        this.col = rcCombo.col;
        this.x = this.col*101;
        this.y = this.row*83;
    }
}

class playerIcon {
    constructor(col,row,sprite){
        this.x = 101*col;
        this.y = 87*row;
        this.col = col;
        this.row = row;
        this.sprite = sprite;
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
    }
}

class selectors extends playerIcon {
    constructor(col,row,sprite){
        super(col,row,sprite);
    }
    update(){
        this.x = 101*this.col;//setting the position -x
        this.y = 87*this.row;//setting the position -y
    }
    handleInput(key){
        if(key==="left"){
            this.col--;
            $("#move-selector")[0].play();
        }
        else if(key==="right"){
            this.col++;
            $("#move-selector")[0].play();
        }
        else if(key==="enter"){
            $("#enter")[0].play();
            for(let icon of iconArray){
                if(this.col===icon.col&&this.row===icon.row){
                    player.sprite=icon.sprite;
                    $("canvas").toggleClass("hide");
                    Engine(window);
                }
            }
            selected = true;
        }

        //taking care of illegal keypresses
        if(this.col===-1) this.col=0;
        if(this.col===5) this.col=4;
        this.update();
    }
}

class Tags{
    constructor(name,col){
        this.name = name;
        this.col = col;
        this.x = 101*col;
    }
    update(){
        this.x = this.col*101;
    }
    render(){
        ctx.fillText(this.name,this.x,5*70);
    }
}


let addon_array = [];

addon_array.push(new collectibles("Blue Gem","images/Gem_Blue.png",100));
addon_array.push(new collectibles("Green Gem","images/Gem_Green.png",200));
addon_array.push(new collectibles("Orange Gem","images/Gem_Orange.png",500));
addon_array.push(new collectibles("health","images/Heart.png",0));
addon_array.push(new collectibles("rock","images/Rock.png",0));

var iconArray = [];
iconArray.push(new playerIcon(0,4,"images/char-boy.png"));
iconArray.push(new playerIcon(1,4,"images/char-cat-girl.png"));
iconArray.push(new playerIcon(2,4,"images/char-horn-girl.png"));
iconArray.push(new playerIcon(3,4,"images/char-pink-girl.png"));
iconArray.push(new playerIcon(4,4,"images/char-princess-girl.png"));

let selector = new selectors(0,4,"images/Selector.png");

let tags = [
    new Tags("Boy",0),
    new Tags("Kitty Girl",1),
    new Tags("Bully Girl",2),
    new Tags("Innocent Pinky",3),
    new Tags("The Queen",4)
];

allEnemies = [];
for(var t=0;t<3;t++){
    allEnemies.push(new Enemy());
}

var player = new players();

document.addEventListener("keyup",function(e){
    let allowedKeys = {
        37:"left",
        39:"right",
        13:"enter"
    };
    console.log(e.keyCode);
    if(game_start===false){
        selector.handleInput(allowedKeys[e.keyCode]);
        if(e.keyCode===13){
            game_start=true;
        }
    }
});

document.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
