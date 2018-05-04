/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(messageDispatcher, gameState, airConsole){

    var game = new SinkItScreen(gameState, airConsole);

    function initialize() {
        /* messages, that will come, when players use the TeamController */
        md.register('joinTeam', game_state.joinTeam);

        /* messages, that will come, when players use the GameController */
        md.register('startAction', game_state.startAction);
        md.register('stopAction', game_state.stopAction);
        // legacy
        md.register('accelerateRight', game_state.accelerateRight);
        md.register('accelerateLeft', game_state.accelerateLeft);
        md.register('vibrate', function vibrateClients() {
            md.broadcast('vibrate');
        });

        // remove player when they leave the session
        airConsole.onActivePlayersChange = game_state.leaveGame;

        // link game state changes and update of DOM
        game_state.on('update', function(state) {
            document.getElementById('gamestate').innerHTML = JSON.stringify(state);

            game.updateBoat('bottom', {acceleration: state.accelerationA});
            game.updateBoat('top', {acceleration: state.accelerationB});
        });
    }

    initialize();

    return {
        game: function(){ return game; }
    };

};
