/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var TeamController = function(divId, messageDispatcher, airConsole) {

    var DEBUG = true;

    var onFinishedCallback = function() {};

    /** game actions **/
    // long running actions
    function joinTeam(team) {
        messageDispatcher.send(
            'joinTeam',
            { team: team }
        );
        if (DEBUG) {
            data = {role:'both', team: 'A'};
            localStorage.setItem('playerData', JSON.stringify(data));
            onFinishedCallback();
        }

        return false;
    }

    function onFinished(callback) {
        onFinishedCallback = callback;
    }

    function create () {
        airConsole.setOrientation(AirConsole.ORIENTATION_LANDSCAPE);

        document.getElementById(divId).innerHTML = '' +
            '<div id="header"><div id="title" class="v-center">Choose your team</div></div>' +
            '<div class="buttons">' +
            '<div id="teamA" class="button">Team Green</div>' +
            '<div id="teamB" class="button">Team Red</div>' +
            '</div>';

        // register event listener
        document.getElementById('teamA').addEventListener('touchstart', function () { return joinTeam('A'); });
        document.getElementById('teamB').addEventListener('touchstart', function () { return joinTeam('B'); });
    }

    /** listen for specific messages **/
    messageDispatcher.register('playerUpdate', function(from, data) {
        if (from !== AirConsole.SCREEN) {
            return;
        }

        localStorage.setItem('playerData', JSON.stringify(data));
        onFinishedCallback();
    });

    /** listen for specific messages **/
    messageDispatcher.register('restartController', function(from, data) {
        if (from !== AirConsole.SCREEN) {
            return;
        }

        localStorage.removeItem('playerData');
        localStorage.removeItem('lastVictory');

        create();
    });

    return {
        create: create,
        onFinished: onFinished
    };
};


