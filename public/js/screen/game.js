/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SinkItScreen = function(){
    
    var config = {
        type: Phaser.AUTO,
        width: 900,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0, x: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);
    var boatTop, boatBottom;
    
    var inputs = {
        move: 0
    };
    
    var getDefaultInputs = function(){
        return inputs;
    };
    
    var boatTopInputs = getDefaultInputs();
    var boatBottomInputs = getDefaultInputs();

    function preload()
    {
        this.load.image('boat', 'assets/boat.png');
        this.load.image('water', 'assets/water.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };

    function create()
    {
        this.add.image(0, 0, 'water').setScale(40);
        boatBottom = this.physics.add.image(450, 0, 'boat');
        boatBottom.setBounce(0);
        boatBottom.setCollideWorldBounds(true);
        
        boatTop = this.physics.add.image(450,550, 'boat');
        boatTop.setBounce(0);
        boatTop.setCollideWorldBounds(true);
    };

    function update()
    {
        boatBottom.setVelocityX(100);
    };
    
    
    return {
        game: game
    };
};


