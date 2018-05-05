/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var VictoryController = function(divId, messageDispatcher, airConsole) {

    var onFinishedCallback = function() {};

    /** game actions **/
    // long running actions

    function onFinished(callback) {
        onFinishedCallback = callback;
    }

    function restart() {
        onFinishedCallback();
        messageDispatcher.send('restart');
    }

    function create () {
        airConsole.setOrientation(AirConsole.ORIENTATION_LANDSCAPE);

        var lastTeamVictory = localStorage.getItem('lastVictory');
        var playerData = localStorage.getItem('playerData');
        var win = playerData.team === lastTeamVictory;

        document.getElementById(divId).innerHTML = '' +
            '<div id="victory">' + (win ? 'VICTORY' : 'LOST') + '</div>' +
            '<div class="buttons">'+
            '<div id="restart" class="button large">RESTART</div>'+
            '</div>'
        ;

        document.getElementById('restart').addEventListener('touchstart', restart);
    }

    return {
        create: create,
        onFinished: onFinished
    };
};


