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
    
    var inputs = {
        acceleration: 0
    };
    
    var getDefaultInputs = function(){
        return inputs;
    };
    
    var boat = {
        top: {
            obj: null,
            inputs: getDefaultInputs()
        },
        bottom: {
            obj: null,
            inputs: getDefaultInputs()
        }
    };

    function preload()
    {
        this.load.image('boat', 'assets/boat.png');
        this.load.image('water', 'assets/water.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };

    function create()
    {
        this.add.image(0, 0, 'water').setScale(40);
        
        boat.bottom.obj = this.physics.add.image(450, 550, 'boat');
        boat.bottom.obj.setBounce(0);
        boat.bottom.obj.setCollideWorldBounds(true);
        
        boat.top.obj = this.physics.add.image(450,0, 'boat');
        boat.top.obj.setBounce(0);
        boat.top.obj.setCollideWorldBounds(true);
    };

    function update()
    {
        
    };
    
    
    var updateBoats = function(boat,value){
        
    };
    
    
    return {
        game: game
    };
};


