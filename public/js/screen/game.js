/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SinkItScreen = function(restart){
    var drag = 20;
    var maxVelocity = 100;
    var boatLives = 1;
    var boatScale = 0.4;
    var restartCallback = restart;
    var stopUpdate = false;
    var ignoreHits = false;

    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    
    var config = {
        type: Phaser.AUTO,
        width: screenWidth,
        height: screenHeight,
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
    var mainCamera;
    var topCamera;
    var bottomCamera;
    
    var boat = {
        top: {
            obj: null,
            data: {
                acceleration: 0,
                lives: boatLives
            }
        },
        bottom: {
            obj: null,
            data: {
                acceleration: 0,
                lives: boatLives
            }
        }
    };
    
    var bullets = [];

    function preload()
    {
                        
        this.load.image('boatBottom', 'assets/boat-red-cannon.png');
        this.load.image('boatTop', 'assets/boat-green-cannon.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('cannonball', 'assets/cannonball.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };
    
    var physics,gameObj;

    function create()
    {   
        gameObj = this; //ugly hack 1
        physics = this.physics; //ugly hack2
        mainCamera = this.cameras.add(0,0,screenWidth,screenHeight);
        
        this.add.image(0, 0, 'water').setScale(window.innerWidth,window.innerHeight);
        
        boat.top.obj = this.physics.add.image(0,70, 'boatTop').setScale(boatScale);
        boat.top.obj.x = Math.max(40, boat.top.obj.getBounds().width*0.5 + Math.random() * (window.innerWidth - boat.top.obj.getBounds().width) - 40);
        boat.top.obj.setBounce(0);
        boat.top.obj.setCollideWorldBounds(true);
        boat.top.obj.setDragX(drag);
        boat.top.obj.setMaxVelocity(maxVelocity);
        boat.top.obj.name = "top";
        
        boat.bottom.obj = this.physics.add.image(0, 0, 'boatBottom').setScale(boatScale);
        boat.bottom.obj.y = window.innerHeight - boat.bottom.obj.getBounds().height*0.5-20;
        boat.bottom.obj.x = Math.max(40, boat.bottom.obj.getBounds().width*0.5 + Math.random() * (window.innerWidth - boat.top.obj.getBounds().width) - 40);
        boat.bottom.obj.setBounce(0);
        boat.bottom.obj.setCollideWorldBounds(true);
        boat.bottom.obj.setDragX(drag);
        boat.bottom.obj.setMaxVelocity(maxVelocity);
        boat.bottom.obj.name = "bottom";

    };
    
    var killObj = function(obj){
        console.log(obj);
        obj.parent.remove(obj);
    };
    
    var fireBullet = function (team, firingBoat) {

        var inverse = 1;
        var innerBorder = firingBoat.getBounds().height;
        if (team == "bottom") {
            inverse = -1;
            innerBorder = 0;
        }

        var bullet = physics.add.image(firingBoat.getCenter().x, firingBoat.getBounds().y + innerBorder, 'cannonball').setScale(0.4);
        if(team == "bottom"){
            bullet.y -= bullet.getBounds().height;
        } else {
            bullet.y += bullet.getBounds().height;
        }
        bullet.setBounce(0);
        bullet.setCollideWorldBounds(false);
        bullet.setVelocityY(100 * inverse);
        bullet.setAccelerationY(20 * inverse);
        physics.add.overlap(bullet, boat.bottom.obj, hitBoat, null, this);
        physics.add.overlap(bullet, boat.top.obj, hitBoat, null, this);
        bullets.push(bullet);       
    };

    function update(){
        
        if(stopUpdate) return;
        
        for(var i = bullets.length - 1; i >= 0; i--){           
            if(bullets[i].x < 0 || bullets[i].x > screenWidth || bullets[i].y < 0 || bullets[i].y > screenHeight){
                bullets[i].destroy();
                bullets.splice(i,1);
            }

        }
        
        if(boat.bottom.data.lives == 0 && boat.bottom.obj.alpha > 0){
            boat.bottom.obj.alpha -= 0.007;
            boat.bottom.obj.angle *= 1.04;
            boatScale *= 0.995;
            boatScale = Math.max(0,boatScale);
            boat.bottom.obj.setScale(boatScale);
        } else if(boat.bottom.data.lives == 0 && boat.bottom.obj.alpha <= 0){
            stopUpdate = true;
            alert("Team Top hat gewonnen!");
            restartCallback();
        }
        
        if(boat.top.data.lives == 0 && boat.top.obj.alpha > 0){
            boat.top.obj.alpha -= 0.007;
            boatScale *= 0.995;
            boatScale = Math.max(0,boatScale);
            boat.top.obj.angle *= 1.04;
            boat.top.obj.setScale(boatScale);
        } else if(boat.top.data.lives == 0 && boat.top.obj.alpha <= 0){
            stopUpdate = true;
            alert("Team Bottom hat gewonnen!");
            restartCallback();
        }
        
    };
    
    var hitBoat = function(attacker,hitBoat){
        if(ignoreHits) return true;
        boat[hitBoat.name].data.lives--;
        var lives = boat[hitBoat.name].data.lives;

        if(lives == 0){
            hitBoat.angle = 1;
            ignoreHits = true;
        }
        mainCamera.shake(150);
        attacker.alpha = 0;
        attacker.disableBody(true, true);
    };
    
    var shoot = function(team){
        fireBullet(team,boat[team].obj);  
    };
    
    var updateBoat = function(team,data){
        
        if(boat[team].data.lives == 0){
            return false;
        }
        
        Object.keys(data).forEach(function(k){
            
            switch(k) {
                case "acceleration":
                    boat[team].obj.setAccelerationX(data[k]);
                    console.log(boat[team].obj.body.velocity);
                    break;
                case "shoot":
                    shoot(team);
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


