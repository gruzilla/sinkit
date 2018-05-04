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
    
    var bullets = [];

    function preload()
    {
                        
        this.load.image('boatBottom', 'assets/boat-red.png');
        this.load.image('boatTop', 'assets/boat-green.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('cannonball', 'assets/cannonball.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };
    
    var physics;

    function create()
    {   
        physics = this.physics;
        var drag = 10;
        var maxVelocity = 65;
        this.add.image(0, 0, 'water').setScale(window.innerWidth,window.innerHeight);
        
        boat.top.obj = this.physics.add.image(0,70, 'boatTop').setScale(0.4);
        boat.top.obj.x = 40 + boat.top.obj.getBounds().width*0.5 + Math.random()*window.innerWidth - boat.top.obj.getBounds().width;
        boat.top.obj.setBounce(0);
        boat.top.obj.setCollideWorldBounds(true);
        boat.top.obj.setDragX(drag);
        boat.top.obj.setMaxVelocity(maxVelocity);
        
        boat.bottom.obj = this.physics.add.image(0, 0, 'boatBottom').setScale(0.4);
        boat.bottom.obj.y = window.innerHeight - boat.bottom.obj.getBounds().height*0.5-20;
        boat.bottom.obj.x = 40 + boat.bottom.obj.getBounds().width*0.5 + Math.random()*window.innerWidth - boat.bottom.obj.getBounds().width;
        boat.bottom.obj.setBounce(0);
        boat.bottom.obj.setCollideWorldBounds(true);
        boat.bottom.obj.setDragX(drag);
        boat.bottom.obj.setMaxVelocity(maxVelocity);

    };
    
    var fireBullet = function(firingBoat){
       var bullet = physics.add.image(firingBoat.getBounds().x + firingBoat.getBounds().width * 0.5, firingBoat.getBounds().y, 'cannonball').setScale(0.4);
       bullet.setBounce(0);
       bullet.setCollideWorldBounds(false);
       bullet.setVelocityY(-100);
       bullet.setAccelerationY(-20);
       bullets.push(bullet);
    };

    function update()
    {

    };
    
    var shoot = function(team){
        fireBullet(boat[team].obj);
    };
    
    var updateBoat = function(team,data){
        
        Object.keys(data).forEach(function(k){
            
            switch(k) {
                case "acceleration":
                    boat[team].obj.setAccelerationX(data[k]);
                    console.log(boat[team].obj.body.velocity);
                    break;
                default:
                    console.log(k,data[k]);
            }
            
        });
        
    };

    
    
    return {
        shoot: shoot,
        updateBoat: updateBoat,
        game: game
    };
};


