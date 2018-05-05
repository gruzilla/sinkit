/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GameController = function(divId, messageDispatcher, airConsole) {
    var onFinishedCallback = function() {};
    var coolDown = {
        loadCannon: false,
        shootCannon: false,
    };
    var coolDownTimeout = 1000;
    var coolDownInterval = 10;
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

    function startCoolDown(coolDownTrigger) {
        if (!(coolDownTrigger in coolDown) || coolDown[coolDownTrigger]) {
            return;
        }

        coolDown[coolDownTrigger] = true;
        var progress = coolDownTimeout;
        var coolDowner = window.setInterval(
            function() {
                progress -= coolDownInterval;
                updateCoolDownObject(coolDownTrigger, 1 - progress / coolDownInterval);
            },
            coolDownInterval
        );
        window.setTimeout(
            function() {
                window.clearInterval(coolDowner);
                coolDown[coolDownTrigger] = false;
                updateCoolDownObject(coolDownTrigger, 'finished');
            },
            coolDownTimeout
        );
    }

    function updateCoolDownObject(object, progress) {
        var element = document.getElementById(object);
        // do smthn with the progress
        if (progress === 'finished') {
            element.classList.remove('cooldown');
        } else {
            if (!element.classList.contains('cooldown')) {
                element.classList.add('cooldown');
            }
        }
    }

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
        if (coolDown.loadCannon) {
            return;
        }
        messageDispatcher.send('loadCannon');
        startCoolDown('loadCannon');
    }
    function shootCannon() {
        if (coolDown.shootCannon) {
            return;
        }
        messageDispatcher.send('shootCannon');
        startCoolDown('shootCannon');
    }
    function vibrate() {
        messageDispatcher.send('vibrate');
        return false;
    }

    function create () {
        airConsole.setOrientation(AirConsole.ORIENTATION_LANDSCAPE);
        var playerData = JSON.parse(localStorage.getItem('playerData'));

        var actionButton = '<div id="loadCannon" class="large button">LOAD</div>';
        var alternativeActionButton = actionButton;
        var teamName = playerData.team === 'A' ? 'Team Green' : 'Team Red';
        var roleName = 'Helmsman';

        if (playerData.role === 'shooter') {
            alternativeActionButton = '';
            actionButton = '<div id="shootCannon" class="large button">SHOOT</div>';
            roleName = 'Cannoneer';
        } else if (playerData.role === 'loader') {
            alternativeActionButton = '';
        } else if (playerData.role === 'both') {
            actionButton = '<div id="shootCannon" class="large button">SHOOT</div>';
            roleName = 'Both';
        }

        var html = '' +
            '<div id="header">' +
            '<div id="title" class="v-center">' +
            teamName +
            '<div class="subtitle">' +
            roleName +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="buttons">' +
            '<div id="accelerateLeft" class="big grad-left button"><</div>' +
            actionButton +
            '<div id="accelerateRight" class="big grad-right button">></div>' +
            '</div>';
            //'<div id="loadCannon" class="button">LOAD</div>' +
            //'<!--<div id="fire" class="button">FIRE</div>-->' +
            //'<div id="shootCannon" class="button">SHOOT</div>' +
            //'<div id="vibrate" class="button">vibe</div>';


        html += '<div id="vibrate" class="button large">vibe</div>' +
            alternativeActionButton;

        // '<!--<div id="fire" class="button">FIRE</div>-->' +

        document.getElementById(divId).innerHTML = html;
        // register event listener
        //document.getElementById('fire').addEventListener('touchstart', startAction);
        //document.getElementById('fire').addEventListener('touchend', stopAction);

        if (playerData.role === 'shooter' || playerData.role === 'both') {
            document.getElementById('shootCannon').addEventListener('touchstart', shootCannon);
        }

        if (playerData.role === 'loader' || playerData.role === 'both') {
            document.getElementById('loadCannon').addEventListener('touchstart', loadCannon);
        }

        document.getElementById('accelerateRight').addEventListener('touchstart', accelerateRight);
        document.getElementById('accelerateLeft').addEventListener('touchstart', accelerateLeft);
        document.getElementById('vibrate').addEventListener('touchstart', vibrate);

        // message handler registration
        messageDispatcher.register('vibrate', function() {
            airConsole.vibrate(200);
        });
        messageDispatcher.register('victory', function(data) {
            localStorage.setItem('lastVictory', data);
            onFinishedCallback();
        });
        /** listen for specific messages **/
        messageDispatcher.register('playerUpdate', function(from, data) {
            console.debug('received new player update');
            if (from !== AirConsole.SCREEN) {
                return;
            }
            console.debug('redrawing');

            localStorage.setItem('playerData', JSON.stringify(data));
            create();
        });
    }

    return {
        create: create,
        onFinished: onFinished
    };
};
