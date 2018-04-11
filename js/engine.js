/*
This is main game engine , but it is not a self calling function.
It is called only when Player selection is complete.
*/

var Engine = function(global) {
     $("#game-bar").toggleClass("hide");                        // Show the Game Status bar.
    var win = global.window,                                    // Global Window object
        canvas = $("#game-screen")[0],                          // select the game screen canvas element
        ctx2 = canvas.getContext('2d');                         // Set the context of canvas to 2D

    canvas.width = 505;                                         // Set the canvas Width
    canvas.height = 606;                                        // Set the canvas Height


    /*
    Main function ones called is called again and again to refresh the Frames
    of the game , which is achieved by requestAnimationFrame() function.
    */
    function main() {
        update();                                               // Function which updates all the Elements on the canvas accordingly
        render();                                               // Function which renders the objects on the canvas according to the frame
        checkEnd();                                             // Function to check whether the game has ended.
        win.requestAnimationFrame(main);                        // Call for the next frame.
    }



    function init() {                                           // Function which further calls the main() function when all the visual resources are loaded.
        main();
    }

    function update() {
        $("#score")[0].innerText = `Score : ${score}`;          // update the score value on the Game Status Bar
        $("#best")[0].innerText = `Best : ${best}`;             // update the Best score on the Game Status Bar
        updateEntities();                                       // Update the Entities present on the canvas

        if(checkCollisions()){                                  // If collision happens,
            player.reset();                                     // Reset the Player Position
            $("#game-stat").addClass("oops");                   // Display a Red bar over the Canvas signifying you collided
            setTimeout(function(){                              // Remove that Bar after 500ms
            $("#game-stat").removeClass("oops");
            },500);
            if(lifenumber>=0)--lifenumber;                      // If Life exists, reduce it by 1
            if(lifenumber===1)$("#life")[0].innerHTML=life1;    // Update the Life numbers on the Game Status bar
            else if(lifenumber===2)$("#life")[0].innerHTML=life2;
            else if(lifenumber===3)$("#life")[0].innerHTML=life3;
            else if(lifenumber===0)$("#life")[0].innerHTML=" ";
            else{                                               // If no life is present , reset the level and scores.
            level=1;
            score=0;
            $("#win")[0].innerText = `Level : ${level}`;        // Update the Level
            }
        }
        collected();                                            // Check whether some collectible is collected,
    }

    function checkEnd() {                                       // function to check the Ending(Winning , to be more specific)

        if(player.row===0) {                                    // If The level is completed , reset everything.
            $("#complete")[0].play();                           // Play the Sound of Level Completion
            norepeat.length=0;                                  // Reset the no repeat Array so that the collectibles can be replaced.
            $("#game-stat").addClass("hurray");                 // display a green bar over the canvas Signifying that Level is complete
            setTimeout(function(){                              // remove the green bar after 500ms
            $("#game-stat").removeClass("hurray");
            },500);

        setTimeout(function(pl){                                // Wait for 1 Frame , then Reset the Player position (60FPS is the standard , so 1 frame is loaded in 16.7 ms)
            pl.reset();
        },15,player);
        level++;                                                // Update the Level
        $("#win")[0].innerText = `Level : ${level}`;            // Update the Level on Game Status Bar
        $("#best")[0].innerText = `Best : ${best}`;             // Update the Best score on the Game status bar
        for(let addon of addon_array){                          // Reset all the collectibles so that they appear at new, random postions
            addon.reset();
        }
        }

    }

    function updateEntities() {                                 // Update Enemies and Player
        allEnemies.forEach(function(enemy) {
            enemy.update();
        });
        player.update();
    }

    function collected(){                                       // To check whether a collectible is collected.
        for(let addon of addon_array){
            if(addon.name!="rock"){                             // If the object is NOT rock , then ->
            if(addon.row===player.row&&addon.col===player.col){ // If the position of collectible & player is same ,
                $("#collect")[0].play();                        // Play the sound of collection
                addon.x=undefined;                              // Empty the x-coordinate of the collectible
                addon.y=undefined;                              // Empty the y-coordinate of the collectible
                addon.row = undefined;                          // Empty the row of the collectible
                addon.col = undefined;                          // Empty the column of the collectible, To make the collectible vanish from the canvas
                score = score+addon.points;                     // Update the score according to the collectible value
                if(best<score)best=score;                       // Update the best score if current score beats the best score.
                if(addon.name=="health"&&lifenumber<3){         // If the collectible is health & health is actually less than three, then ->
                    if(lifenumber===-1)lifenumber=1;            // If Health is -1 , then make it 1.
                    else ++lifenumber;                          // Increment the Health.
                    if(lifenumber===1)$("#life")[0].innerHTML=life1;    // Display the health icons according to the life number.
                    else if(lifenumber===2)$("#life")[0].innerHTML=life2;
                    else if(lifenumber===3)$("#life")[0].innerHTML=life3;
                }
               }
            }
        }
    }

    function checkCollisions(){                                 // Function to check the player enemy collisions
        for(let enemy of allEnemies){                           //Looping through the enemies,
          if(player.row===enemy.row){                           // If player row & enemy row are same ,
            if(player.x+70>enemy.x&&enemy.x+70>player.x){       // If the enemy touches the player OR player touches the enemy,
                $("#collide")[0].play();                        // Play the sound of collision
                return true;                                    // Return True , which signifies that the collision has happened.
            }
          }
        }
        return false;                                           // If Nothing happens then return False , ( collision has not taken place)
    }

    function render() {                                         // Function to render all the Entities on the canvas.
        var rowImages = [                                       // Array which contains all the image paths of watch to render.
                'images/water-block.png',                       // Top row is water
                'images/stone-block.png',                       // Row 1 of 3 of stone
                'images/stone-block.png',                       // Row 2 of 3 of stone
                'images/stone-block.png',                       // Row 3 of 3 of stone
                'images/grass-block.png',                       // Row 1 of 2 of grass
                'images/grass-block.png'                        // Row 2 of 2 of grass
            ],
            numRows = 6,                                        // number of rows,
            numCols = 5,                                        // number of columns
            row, col;                                           // Present Row and column
        ctx2.clearRect(0,0,canvas.width,canvas.height);         // Clear the Present frame

        for (row = 0; row < numRows; row++) {                   // Lopp to place all the objects accordingly.
            for (col = 0; col < numCols; col++) {
                ctx2.drawImage(Resources.get(rowImages[row]), col * 101, row * 87);
            }
        }
        for(let addon of addon_array){                          // Loop to place all the collectibles accordingly
            addon.render();
        }
        renderEntities();                                       // Function to Render Enemies and Player.
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {                    // Loop to render all the Enemies.
            enemy.render();
        });
        player.render();                                        // Loop to Render the Player
    }



document.addEventListener('keyup', function(e) {                // A Keyup event Listener to control the player on canvas.
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);                 // Calls the handleInput Function of the player , sending in the keyname of the key pressed.
});


    Resources.load([                                            // Load all the visual resources we need in game
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
    Resources.onReady(init);                                    // Call the init() function when all the visual resources are loaded.
    global.ctx2 = ctx2;
};
