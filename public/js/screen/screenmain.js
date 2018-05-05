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
        gameState.on('update', function(updateChange) {

            // debug
            document.getElementById('gamestate').innerHTML = JSON.stringify(updateChange.state);

            switch(updateChange.action) {
                case 'startAction':
                    if (updateChange.team === 'A') {
                        var teamAShield = updateChange.state.teamA.player.length > 0;
                        for (var i = 0; i < updateChange.state.teamA.player.length; i++) {
                            var playerA = updateChange.state.player[updateChange.state.teamA.player[i]];
                            if (typeof(playerA.actions) === 'undefined') {
                                teamAShield = false;
                                break;
                            }
                            if (!playerA.actions.hasOwnProperty('shield') || !playerA.actions.shield) {
                                teamAShield = false;
                                break;
                            }
                        }
                        console.log('team a shield ', teamAShield);
                        if (teamAShield) {
                            game.updateBoat('top', {shield: true});
                        }
                    }

                    if (updateChange.team === 'B') {
                        var teamBShield = updateChange.state.teamB.player.length > 0;
                        for (var j = 0; j < updateChange.state.teamB.player.length; j++) {
                            var playerB = updateChange.state.player[updateChange.state.teamB.player[j]];
                            if (typeof(playerB.actions) === 'undefined') {
                                teamBShield = false;
                                break;
                            }
                            if (!playerB.actions.hasOwnProperty('shield') || !playerB.actions.shield) {
                                teamBShield = false;
                                break;
                            }
                        }
                        console.log('team b shield ', teamBShield);
                        if (teamBShield) {
                            game.updateBoat('bottom', {shield: true});
                        }
                    }



                    if (updateChange.team === 'A' && updateChange.state.teamA.fullstop) {
                        game.updateBoat('top', {fullstop: true});
                        updateChange.state.teamA.fullstop = false;
                    }
                    if (updateChange.team === 'B' && updateChange.state.teamB.fullstop) {
                        game.updateBoat('bottom', {fullstop: true});
                        updateChange.state.teamB.fullstop = false;
                    }

                    break;
                case 'stopAction':
                    break;
                case 'joinTeam':
                    break;
                case 'leaveGame':
                    break;
                case 'loadCannon':
                    break;
                case 'shootCannon':
                    if (updateChange.team === 'A' && updateChange.state.teamA.cannonLoaded && updateChange.state.teamA.shootCannon) {
                        game.updateBoat('top', {shoot: true});
                    }
                    if (updateChange.team === 'B' && updateChange.state.teamB.cannonLoaded && updateChange.state.teamB.shootCannon) {
                        game.updateBoat('bottom', {shoot: true});
                    }
                    break;
                case 'accelerate':
                    if (updateChange.team === 'A') {
                        game.updateBoat('top', {velocity: updateChange.state.teamA.velocity});
                    }
                    if (updateChange.team === 'B') {
                        game.updateBoat('bottom', {velocity: updateChange.state.teamB.velocity});
                    }
                    break;
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
