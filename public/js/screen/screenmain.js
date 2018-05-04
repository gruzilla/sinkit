/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(messageDispatcher, gameState, airConsole){

    var game;

    var restart = function(){
        delete game;
        document.getElementById("game").innerHTML = "";
        game = new SinkItScreen(restart);
    };

    game = new SinkItScreen(restart);

    function initialize() {
        /* messages, that will come, when players use the TeamController */
        md.register('joinTeam', gameState.joinTeam);

        /* messages, that will come, when players use the GameController */
        md.register('startAction', gameState.startAction);
        md.register('stopAction', gameState.stopAction);
        // legacy
        md.register('accelerate', gameState.accelerate);
        md.register('loadCannon', gameState.loadCannon);
        md.register('shootCannon', gameState.shootCannon);
        md.register('vibrate', function vibrateClients() {
            md.broadcast('vibrate');
        });

        // remove player when they leave the session
        airConsole.onActivePlayersChange = gameState.leaveGame;

        // link game state changes and update of DOM
        gameState.on('update', function(state) {
            document.getElementById('gamestate').innerHTML = JSON.stringify(state);

            game.updateBoat('top', {acceleration: state.teamA.acceleration});
            game.updateBoat('bottom', {acceleration: state.teamB.acceleration});

            if (state.teamA.cannonLoaded && state.teamA.shootCannon) {
                game.updateBoat('top', {shoot: true});
            }
            if (state.teamB.cannonLoaded && state.teamB.shootCannon) {
                game.updateBoat('bottom', {shoot: true});
            }
        });

        gameState.on('updatePlayer', function(player, data) {
            md.send('updatePlayer', data, player);
        });

        // initialize acceleration obstacle
        gameState.startAccelerationTimer();
    }

    initialize();

    return {
        game: function(){ return game; }
    };

};
