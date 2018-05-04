/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SinkItScreen = function(){
    
    var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: "game",
        zoom: 1,
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
                        
        this.load.image('boatBottom', 'assets/boat-red.png');
        this.load.image('boatTop', 'assets/boat-green.png');
        this.load.image('water', 'assets/water.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };

    function create()
    {   
        var drag = 10;
        this.add.image(0, 0, 'water').setScale(window.innerWidth,window.innerHeight);
        
        boat.top.obj = this.physics.add.image(0,70, 'boatTop').setScale(0.4);
        boat.top.obj.x = 40 + boat.top.obj.getBounds().width*0.5 + Math.random()*window.innerWidth - boat.top.obj.getBounds().width;
        boat.top.obj.setBounce(0);
        boat.top.obj.setCollideWorldBounds(true);
        boat.top.obj.setDragX(drag);
        
        boat.bottom.obj = this.physics.add.image(0, 0, 'boatBottom').setScale(0.4);
        boat.bottom.obj.y = window.innerHeight - boat.bottom.obj.getBounds().height*0.5-20;
        boat.bottom.obj.x = 40 + boat.bottom.obj.getBounds().width*0.5 + Math.random()*window.innerWidth - boat.bottom.obj.getBounds().width;
        boat.bottom.obj.setBounce(0);
        boat.bottom.obj.setCollideWorldBounds(true);
        boat.bottom.obj.setDragX(drag);

        
    };

    function update()
    {
        
    };    
    
    var updateBoat = function(team,data){
        
        Object.keys(data).forEach(function(k){
            
            switch(k) {
                case "acceleration":
                    boat[team].obj.setAccelerationX(data[k]);
                    break;
                default:
                    console.log(k,data[k]);
            }
            
        });
        
    };
    
    
    return {
        updateBoat: updateBoat,
        game: game
    };
};


