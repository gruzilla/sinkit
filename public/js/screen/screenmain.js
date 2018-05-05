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
                    var teamAShield = updateChange.stateteamA.player.length > 0;
                    for (var i = 0; i < updateChange.stateteamA.player.length; i++) {
                        var playerA = updateChange.stateplayer[updateChange.stateteamA.player[i]];
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

                    var teamBShield = updateChange.stateteamB.player.length > 0;
                    for (var j = 0; j < updateChange.stateteamB.player.length; j++) {
                        var playerB = updateChange.stateplayer[updateChange.stateteamB.player[j]];
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



                    if (updateChange.state.teamA.fullstop) {
                        game.updateBoat('top', {fullstop: true});
                        updateChange.state.teamA.fullstop = false;
                    }
                    if (updateChange.state.teamB.fullstop) {
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
                    if (updateChange.state.teamA.cannonLoaded && updateChange.state.teamA.shootCannon) {
                        game.updateBoat('top', {shoot: true});
                    }
                    if (updateChange.state.teamB.cannonLoaded && updateChange.state.teamB.shootCannon) {
                        game.updateBoat('bottom', {shoot: true});
                    }
                    break;
                case 'accelerate':
                    game.updateBoat('top', {velocity: updateChange.state.teamA.velocity});
                    game.updateBoat('bottom', {velocity: updateChange.state.teamB.velocity});
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
