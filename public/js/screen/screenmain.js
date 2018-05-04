/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(messageDispatcher, gameState, airConsole){

    var game = new SinkItScreen(gameState, airConsole);

    function initialize() {
        /* messages, that will come, when players use the TeamController */
        md.register('joinTeam', gameState.joinTeam);

        /* messages, that will come, when players use the GameController */
        md.register('startAction', gameState.startAction);
        md.register('stopAction', gameState.stopAction);
        // legacy
        md.register('accelerateRight', gameState.accelerateRight);
        md.register('accelerateLeft', gameState.accelerateLeft);
        md.register('vibrate', function vibrateClients() {
            md.broadcast('vibrate');
        });

        // remove player when they leave the session
        airConsole.onActivePlayersChange = gameState.leaveGame;

        // link game state changes and update of DOM
        gameState.on('update', function(state) {
            document.getElementById('gamestate').innerHTML = JSON.stringify(state);

            game.updateBoat('top', {acceleration: state.accelerationA});
            game.updateBoat('bottom', {acceleration: state.accelerationB});
        });

        // initialize acceleration obstacle
        gameState.startAccelerationTimer();
    }

    initialize();

    return {
        game: function(){ return game; }
    };

};
