/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(messageDispatcher, gameState, airConsole){

    function initialize() {
        // link game state and messages received from clients
        md.register('startAction', game_state.startAction);
        md.register('stopAction', game_state.stopAction);

        /* legacy +-vib game */
        md.register('increment', game_state.increment);
        md.register('decrement', game_state.decrement);
        md.register('vibrate', function vibrateClients() {
            md.broadcast('vibrate');
        });

        // link game state changes and update of DOM
        game_state.on('update', function(state) {
            document.getElementById('gamestate').innerHTML = JSON.stringify(state);
        });
    }

    var game = new SinkItScreen(gameState, airConsole);
    initialize();

    return {
        game: function(){ return game; }
    };

};


// initialize dependencies


air_console.onDeviceStateChange = function(device_id, user_data) {
    var ids = air_console.getControllerDeviceIds();
    document.getElementById('deviceIds').innerHTML = JSON.stringify([ids, user_data]);
};
