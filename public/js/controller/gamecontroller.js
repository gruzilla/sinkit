/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GameController = function(divId, messageDispatcher, airConsole) {
    var onFinishedCallback = function() {};

    /** game actions **/
    // long running actions
    function startAction() {
        messageDispatcher.send(
            'startAction',
            { action: 'supaÄktschn' }
        );
        return false;
    }
    function stopAction() {
        messageDispatcher.send(
            'stopAction',
            { action: 'supaÄktschn' }
        );
        return false;
    }

    function onFinished(callback) {
        onFinishedCallback = callback;
    }

    /** legacy game **/
    // local event-listeners, that send or broadcast messages
    function increment() {
        messageDispatcher.send('increment');
        return false;
    }
    function decrement() {
        messageDispatcher.send('decrement');
        return false;
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
            '<div id="action" class="button">action</div>' +
            '<div id="increment" class="button">+1</div>' +
            '<div id="decrement" class="button">-1</div>' +
            '<div id="vibrate" class="button">vibrate all</div>';

        // register event listener
        document.getElementById('action').addEventListener('mousedown', startAction);
        document.getElementById('action').addEventListener('touchstart', startAction);
        document.getElementById('action').addEventListener('mouseup', stopAction);
        document.getElementById('action').addEventListener('touchend', stopAction);

        /** legacy games **/
        document.getElementById('increment').addEventListener('click', increment);
        document.getElementById('decrement').addEventListener('click', decrement);
        document.getElementById('vibrate').addEventListener('click', vibrate);
        document.getElementById('increment').addEventListener('touchstart', increment);
        document.getElementById('decrement').addEventListener('touchstart', decrement);
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
