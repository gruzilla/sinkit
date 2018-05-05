/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Screen = function(messageDispatcher, gameState, airConsole){

    var game;

    var victory = function(team){
        messageDispatcher.broadcast('victory', team);
    };

    var restart = function(){
        delete game;
        messageDispatcher.broadcast('restartController');
        document.getElementById('game').innerHTML = '';
        gameState.initState();
        game = new SinkItScreen(restart, victory);
    };

    game = new SinkItScreen(restart,victory);

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
        md.register('restart', restart);

        // remove player when they leave the session
        airConsole.onActivePlayersChange = gameState.leaveGame;

        // link game state changes and update of DOM
        gameState.on('update', function(state) {
            document.getElementById('gamestate').innerHTML = JSON.stringify(state);

            game.updateBoat('top', {velocity: state.teamA.velocity});
            game.updateBoat('bottom', {velocity: state.teamB.velocity});

            if (state.teamA.cannonLoaded && state.teamA.shootCannon) {
                game.updateBoat('top', {shoot: true});
            }
            if (state.teamB.cannonLoaded && state.teamB.shootCannon) {
                game.updateBoat('bottom', {shoot: true});
            }

            var teamAShield = true;
            for (var i = 0; i < state.teamA.player.length; i++) {
                var playerA = state.teamA.player[i];
                if (!playerA.actions.hasOwnProperty('shield') || !playerA.actions.shield) {
                    teamAShield = false;
                    break;
                }
            }
            console.log('team a shield ', teamAShield);
            if (teamAShield) {
                game.updateBoat('top', {shield: true});
            }

            var teamBShield = true;
            for (var j = 0; j < state.teamB.player.length; j++) {
                var playerB = state.teamB.player[j];
                if (!playerB.actions.hasOwnProperty('shield') || !playerB.actions.shield) {
                    teamBShield = false;
                    break;
                }
            }
            console.log('team b shield ', teamBShield);
            if (teamBShield) {
                game.updateBoat('bottom', {shield: true});
            }
        });

        gameState.on('playerChosen', function(data) {
            md.send('playerUpdate', data.data, data.id);
        });

        // initialize acceleration obstacle
        // gameState.startAccelerationTimer();
    }

    initialize();

    return {
        game: function(){ return game; }
    };

};
