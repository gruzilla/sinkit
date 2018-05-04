/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SinkItScreen = function(){
  
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        //this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create ()
    {
        //this.add.image(400, 300, 'sky');
    }

    function update ()
    {
        
    }
    
    
    return {
        
    };
};


