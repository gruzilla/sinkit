/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GameController = function(divId, messageDispatcher, airConsole) {
    var onFinishedCallback = function() {};
    var hapticFeedback = 15;

    /** game actions **/
    // long running actions
    function startAction() {
        messageDispatcher.send(
            'startAction',
            { action: 'fire' }
        );
        return false;
    }
    function stopAction() {
        messageDispatcher.send(
            'stopAction',
            { action: 'fire' }
        );
        return false;
    }

    function onFinished(callback) {
        onFinishedCallback = callback;
    }

    /** legacy game **/
    // local event-listeners, that send or broadcast messages
    function accelerateRight() {
        airConsole.vibrate(hapticFeedback);
        messageDispatcher.send('accelerate', {direction:'right'});
        return false;
    }
    function accelerateLeft() {
        airConsole.vibrate(hapticFeedback);
        messageDispatcher.send('accelerate', {direction:'left'});
        return false;
    }
    function loadCannon() {
        messageDispatcher.send('loadCannon');
    }
    function vibrate() {
        messageDispatcher.send('vibrate');
        return false;
    }

    function preload () {
        //this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create () {
        airConsole.setOrientation(AirConsole.ORIENTATION_LANDSCAPE);

        document.getElementById(divId).innerHTML = '' +
            '<div id="accelerateLeft" class="button">LEFT</div>' +
            '<div id="accelerateRight" class="button">RIGHT</div>' +
            '<div id="loadCannon" class="button">LOAD</div>' +
            '<div id="fire" class="button">FIRE</div>' +
            '<div id="vibrate" class="button">vibe</div>';

        // register event listener
        //document.getElementById('fire').addEventListener('mousedown', startAction);
        document.getElementById('fire').addEventListener('touchstart', startAction);
        //document.getElementById('fire').addEventListener('mouseup', stopAction);
        document.getElementById('fire').addEventListener('touchend', stopAction);

        //document.getElementById('loadCannon').addEventListener('mousedown', loadCannon);
        document.getElementById('loadCannon').addEventListener('touchstart', loadCannon);

        //document.getElementById('accelerateRight').addEventListener('click', accelerateRight);
        //document.getElementById('accelerateLeft').addEventListener('click', accelerateLeft);
        //document.getElementById('vibrate').addEventListener('click', vibrate);
        document.getElementById('accelerateRight').addEventListener('touchstart', accelerateRight);
        document.getElementById('accelerateLeft').addEventListener('touchstart', accelerateLeft);
        document.getElementById('vibrate').addEventListener('touchstart', vibrate);

        // message handler registration
        messageDispatcher.register('vibrate', function() {
            airConsole.vibrate(200);
        });
    }

    function update () {

    }

    return {
        create: create
    };
};
