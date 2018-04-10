

var Engine = function(global) {
     $("#game-bar").toggleClass("hide");
    var win = global.window,
        canvas = $("#game-screen")[0],
        ctx2 = canvas.getContext('2d');

    canvas.width = 505;
    canvas.height = 606;

     // This function is a loop;
    function main() {
        update();
        render();
        checkEnd();
        win.requestAnimationFrame(main);
    }

    function init() {
        main();
    }

    function update(dt) {
        $("#score")[0].innerText = `Score : ${score}`;
        updateEntities(dt);
        if(checkCollisions()){
            player.reset();
            $("#game-stat").addClass("oops");
            setTimeout(function(){
            $("#game-stat").removeClass("oops");
            },200);
            if(lifenumber>=0)--lifenumber;
            if(lifenumber===1)$("#life")[0].innerHTML=life1;
            else if(lifenumber===2)$("#life")[0].innerHTML=life2;
            else if(lifenumber===3)$("#life")[0].innerHTML=life3;
            else if(lifenumber===0)$("#life")[0].innerHTML=" ";
            else{
            level=1;
            score=0;
            $("#win")[0].innerText = `Level : ${level}`;
            }
        }
        collected();
    }

    function checkEnd() {
        if(player.row===0) {  // If The game is completed , reset everything.
            //Insert Sound of winning
            $("#complete")[0].play();
            norepeat.length=0;
            $("#game-stat").addClass("hurray");
            setTimeout(function(){
            $("#game-stat").removeClass("hurray");
            },200);

        setTimeout(function(pl){
            pl.reset();
        },15,player); // Wait for 1-2 frames , And then Reset.
        level++; // Update the Wins
        if(best<score)best=score; // Update Best if Its Wins are equal to Best
        $("#win")[0].innerText = `Level : ${level}`;
        $("#best")[0].innerText = `Best : ${best}`;
        for(let addon of addon_array){
            addon.reset();
        }
        }

    }
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function collected(){
        for(let addon of addon_array){
            if(addon.name!="rock"){
                //Insert Sound of collection

            if(addon.row===player.row&&addon.col===player.col){
                $("#collect")[0].play();
                addon.x=undefined;
                addon.y=undefined;
                addon.row = undefined;
                addon.col = undefined;
                score = score+addon.points;
                if(addon.name=="health"&&lifenumber<3){
                    if(lifenumber===-1)lifenumber=1;
                    else ++lifenumber;
                    if(lifenumber===1)$("#life")[0].innerHTML=life1;
                    else if(lifenumber===2)$("#life")[0].innerHTML=life2;
                    else if(lifenumber===3)$("#life")[0].innerHTML=life3;
                }
               }
            }
        }
    }

    function checkCollisions(){
        for(let enemy of allEnemies){
          if(player.row===enemy.row){
            if(player.x+70>enemy.x&&enemy.x+70>player.x){
                //Insert Sound of collission
                $("#collide")[0].play();
                return true;
            }
          }
        }
        return false;
    }

    function render() {
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        ctx2.clearRect(0,0,canvas.width,canvas.height);

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx2.drawImage(Resources.get(rowImages[row]), col * 101, row * 87);
            }
        }
        for(let addon of addon_array){
            addon.render();
        }
        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }



document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem_Blue.png',
        'images/Gem_Green.png',
        'images/Gem_Orange.png',
        'images/Heart.png',
        'images/Rock.png'

    ]);
    Resources.onReady(init);
    global.ctx2 = ctx2;
};
