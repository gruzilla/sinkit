/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var TeamController = function(divId, messageDispatcher, airConsole) {

    var onFinishedCallback = function() {};

    /** game actions **/
    // long running actions
    function joinTeam(team) {
        messageDispatcher.send(
            'joinTeam',
            { team: team }
        );
        onFinishedCallback();
        return false;
    }

    function onFinished(callback) {
        onFinishedCallback = callback;
    }

    function preload () {
        //this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        //this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create () {
        airConsole.setOrientation(AirConsole.ORIENTATION_LANDSCAPE);

        document.getElementById(divId).innerHTML = '' +
            '<div id="teamA" class="button">Team TOP</div>' +
            '<div id="teamB" class="button">Team BOTTOM</div>';

        // register event listener
        document.getElementById('teamA').addEventListener('click', function () { return joinTeam('A'); });
        document.getElementById('teamA').addEventListener('touchstart', function () { return joinTeam('A'); });
        document.getElementById('teamB').addEventListener('click', function () { return joinTeam('B'); });
        document.getElementById('teamB').addEventListener('touchstart', function () { return joinTeam('B'); });
    }

    function update () {

    }

    return {
        create: create,
        onFinished: onFinished
    };
};


