/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SinkItScreen = function(restart,victory){
    var drag = 30;
    var friction = 10;
    var maxVelocity = 160;
    var boatLives = 3;
    var boatScale = 0.4;
    var restartCallback = restart;
    var victoryCallback = victory;
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
    var victoryTop, victoryBottom;
    
    var boat = {
        top: {
            obj: null,
            data: {
                acceleration: 0,
                lives: boatLives,
                shield: false
            }
        },
        bottom: {
            obj: null,
            data: {
                acceleration: 0,
                lives: boatLives,
                shield: false
            }
        }
    };
    
    var bullets = [];
    var heartsTop = [];
    var heartsBottom = [];

    function preload()
    {
                        
        this.load.image('boatBottom', 'assets/boat-red-cannon.png');
        this.load.image('boatTop', 'assets/boat-green-cannon.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('victory-top', 'assets/pirate-green.png');
        this.load.image('victory-bottom', 'assets/pirate-red.png');
        this.load.image('cannonball', 'assets/cannonball.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    };
    
    var physics,gameObj;
    
    var buildHearts = function(){
        
        var startPositionY = screenHeight * 0.5 - boatLives * 0.5 * 30;
        
        for(var i = 0; i < boatLives; i++){
            var heart = physics.add.image(30, startPositionY + 30 * i, 'boatTop').setScale(0.05);
            heart.alpha = 0.5;
            heartsTop.push(heart);
            heart = physics.add.image(screenWidth - 40, startPositionY + 30 * i, 'boatBottom').setScale(0.05);
            heart.alpha = 0.5;
            heartsBottom.push(heart);           
        }
        
    };

    function create()
    {   
        gameObj = this; //ugly hack 1
        physics = this.physics; //ugly hack2
        mainCamera = this.cameras.add(0,0,screenWidth,screenHeight);
        
        
        
        this.add.image(0, 0, 'water').setScale(screenWidth,screenHeight);
                
        boat.top.obj = this.physics.add.image(0,70, 'boatTop').setScale(boatScale);
        boat.top.obj.x = Math.max(40, boat.top.obj.getBounds().width*0.5 + Math.random() * (window.innerWidth - boat.top.obj.getBounds().width) - 40);
        boat.top.obj.setBounce(0);
        boat.top.obj.setCollideWorldBounds(true);
        boat.top.obj.setDragX(drag);
        boat.top.obj.setFrictionX(friction);
        boat.top.obj.setMaxVelocity(maxVelocity);
        boat.top.obj.name = "top";
        
        boat.bottom.obj = this.physics.add.image(0, 0, 'boatBottom').setScale(boatScale);
        boat.bottom.obj.y = window.innerHeight - boat.bottom.obj.getBounds().height*0.5-20;
        boat.bottom.obj.x = Math.max(40, boat.bottom.obj.getBounds().width*0.5 + Math.random() * (window.innerWidth - boat.top.obj.getBounds().width) - 40);
        boat.bottom.obj.setBounce(0);
        boat.bottom.obj.setCollideWorldBounds(true);
        boat.bottom.obj.setDragX(drag);
        boat.bottom.obj.setFrictionX(friction);
        boat.bottom.obj.setMaxVelocity(maxVelocity);
        boat.bottom.obj.name = "bottom";
        
        victoryTop = this.add.image(screenWidth * 0.5,screenHeight * 0.5,'victory-top').setScale(0.8).setInteractive();
        victoryTop.alpha = 0;
        victoryTop.on('pointerup',restartCallback);
        victoryBottom = this.add.image(screenWidth * 0.5,screenHeight * 0.5,'victory-bottom').setScale(0.8).setInteractive();
        victoryBottom.alpha = 0;
        victoryBottom.on('pointerup',restartCallback);
        
        buildHearts();

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
            bullet.x += 22;
        } else {
            bullet.y += bullet.getBounds().height;
            bullet.x -= 12;
        }
        bullet.setBounce(0);
        bullet.setCollideWorldBounds(false);
        bullet.setVelocityY(100 * inverse);
        if(firingBoat.body.velocity.x < 0){
            bullet.setVelocityX(Math.random()*-10);
            bullet.setAccelerationX(-0.25 * firingBoat.body.acceleration.x);
        } else if((firingBoat.body.velocity.x > 0)) {
            bullet.setVelocityX(Math.random()*10);
            bullet.setAccelerationX(0.25 * firingBoat.body.acceleration.x);
        }
        bullet.setAccelerationY(20 * inverse);
        physics.add.overlap(bullet, boat.bottom.obj, hitBoat, null, this);
        physics.add.overlap(bullet, boat.top.obj, hitBoat, null, this);
        bullets.push(bullet);       
    };

    function update(){
        
        if(stopUpdate){
            return;
        }
        
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
        }
        
        if(boat.top.data.lives == 0 && boat.top.obj.alpha > 0){
            boat.top.obj.alpha -= 0.007;
            boatScale *= 0.995;
            boatScale = Math.max(0,boatScale);
            boat.top.obj.angle *= 1.04;
            boat.top.obj.setScale(boatScale);
        } else if(boat.top.data.lives == 0 && boat.top.obj.alpha <= 0){
            stopUpdate = true;
        }
        
    };
    
    var hitShield = function(attacker,hitBoat){
        attacker.setVelocityX(attacker.body.velocity.x * -1.25);
        attacker.setVelocityY(attacker.body.velocity.y * -1.25);
        attacker.setAccelerationX(attacker.body.acceleration.x * -2.25);
        attacker.setAccelerationY(attacker.body.acceleration.y * -1.25);
    };
    
    var hitBoat = function(attacker,hitBoat){
        if(ignoreHits) return true;
        if(boat[hitBoat.name].data.shield){
            hitShield(attacker,hitBoat);
            return true;
        }
        boat[hitBoat.name].data.lives--;
        var lives = boat[hitBoat.name].data.lives;
        
        var lostHeart;
        switch(hitBoat.name){
            case "top":
                if(heartsTop.length != 0){
                    lostHeart = heartsTop.pop();
                    lostHeart.blendMode = Phaser.BlendModes.ADD;
                    gameObj.tweens.add({
                        targets: lostHeart,
                        alpha: 0,
                        angle: -720,
                        duration: 700,
                        ease: 'Cubic.easeInOut',
                        delay: 0
                    });
                }
                break;
            case "bottom":
                if(heartsBottom.length != 0){
                    lostHeart = heartsBottom.pop();
                    lostHeart.blendMode = Phaser.BlendModes.ADD;
                    gameObj.tweens.add({
                        targets: lostHeart,
                        alpha: 0,
                        angle: 720,
                        duration: 700,
                        ease: 'Cubic.easeInOut',
                        delay: 0
                    });
                }
                break;
            default:
        }

        if(lives == 0){
            var winner = "top";
            if(hitBoat.name == "top"){
                winner = "bottom";
                gameObj.tweens.add({
                    targets: victoryBottom,
                    alpha: 1,
                    duration: 2000,
                    ease: 'Quad.easeIn',
                    delay: 1500
                });
            } else {
                gameObj.tweens.add({
                    targets: victoryTop,
                    alpha: 1,
                    duration: 2000,
                    ease: 'Quad.easeIn',
                    delay: 1500
                });
            }
            victoryCallback(winner);
            hitBoat.angle = 1;
            ignoreHits = true;
            
        }
        mainCamera.shake(550);
        attacker.alpha = 0;
        attacker.disableBody(true, true);
    };
    
    var shoot = function(team){
        fireBullet(team,boat[team].obj);  
    };
    
    var activateShield = function(team){
        boat[team].obj.blendMode = Phaser.BlendModes.ADD;
        var shield = gameObj.tweens.add({
            targets: boat[team].obj,
            alpha: 0.5,
            duration: 400,
            ease: 'Cubic.easeInOut',
            delay: 0,
            repeat: 2,
            yoyo: true 
        });
        shield.setCallback("onComplete",function(team){
            boat[team].obj.blendMode = Phaser.BlendModes.NORMAL;
            boat[team].data.shield = false;
        },[team]);
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
                    console.log(boat[team].obj.body.acceleration);
                    break;
                case "velocity":
                    boat[team].obj.setVelocityX(boat[team].obj.body.velocity + data[k]);
                    console.log(boat[team].obj.body.velocity);
                    console.log(boat[team].obj.body.acceleration);
                    break;
                case "fullstop":
                    boat[team].obj.setVelocityX(0);
                    break;
                case "shield":
                    activateShield(team);
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


