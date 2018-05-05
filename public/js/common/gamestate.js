var GameState = function() {
    var accelerationStep = 50;
    var accelerationMin = -300;
    var accelerationMax = 300;
    var accelerationTimer = null;
    var accelerationReductionInterval = 750;
    var initialRole = 'both';
    var availableRoles = ['shooter', 'loader'];

    var state = {
        player: {},
        teamA: {
            player: [],
            acceleration: 0,
            cannonLoaded: false,
            shootCannon: false,
            roleIndex: 0
        },
        teamB: {
            player: [],
            acceleration: 0,
            cannonLoaded: false,
            shootCannon: false,
            roleIndex: 0
        }
    };

    var listener = {};

    function dispatch(type, data) {
        if (typeof(data) === 'undefined') {
            data = state;
        }
        for (var i in listener) {
            if (listener.hasOwnProperty(i) && type === i) {
                listener[type](data);
            }
        }
    }

    function on(type, callback) {
        listener[type] = callback.bind(this);
    }

    function getTeam(from) {
        if (state.teamA.player.indexOf(from) > -1) return 'A';
        if (state.teamB.player.indexOf(from) > -1) return 'B';
    }

    function initPlayer(from) {
        if (from in state.player) {
            return;
        }

        state.player[from] = {
            actions: {},
            team: '',
            role: ''
        }
    }

    function startAction(from, data) {
        console.log('GS change: startAction');

        initPlayer(from);
        state.player[from].actions[data.action] = true;

        dispatch('update');
    }

    function stopAction(from, data) {
        console.log('GS change: stopAction');

        initPlayer(from);
        delete state.player[from].actions[data.action];

        dispatch('update');
    }

    function joinTeam(from, data) {
        console.log('GS change: joinTeam');

        initPlayer(from);
        state.player[from].team = data.team;
        var firstPlayer = false;

        if (data.team === 'A') {
            firstPlayer = state.teamA.player.length === 0;
            state.player[from].role = firstPlayer ? initialRole : availableRoles[state.teamA.roleIndex];
            state.teamA.player.push(from);

            state.teamA.roleIndex++;
            if (state.teamA.roleIndex >= availableRoles.length) {
                state.teamA.roleIndex = 0;
            }
        } else if (data.team === 'B') {
            firstPlayer = state.teamB.player.length === 0;
            state.player[from].role = firstPlayer ? initialRole : availableRoles[state.teamB.roleIndex];
            state.teamB.player.push(from);

            state.teamB.roleIndex++;
            if (state.teamB.roleIndex >= availableRoles.length) {
                state.teamB.roleIndex = 0;
            }
        }

        dispatch('update');
        dispatch('playerChosen', {
            id: from,
            data: state.player[from]
        });
        if (!firstPlayer) {
            if (data.team === 'A') {
                var newARole = availableRoles[state.teamA.roleIndex];
                state.teamA.roleIndex++;
                if (state.teamA.roleIndex >= availableRoles.length) {
                    state.teamA.roleIndex = 0;
                }
                state.player[state.teamA.player[0]].role = newARole;
                state.player[state.teamA.player[0]].team = 'A';

                dispatch('playerChosen', {
                    id: state.teamA.player[0],
                    data: state.player[state.teamA.player[0]]
                });
            } else if (data.team === 'B') {
                var newBRole = availableRoles[state.teamB.roleIndex];
                state.teamB.roleIndex++;
                if (state.teamB.roleIndex >= availableRoles.length) {
                    state.teamB.roleIndex = 0;
                }
                state.player[state.teamB.player[0]].role = newBRole;
                state.player[state.teamB.player[0]].team = 'B';

                dispatch('playerChosen', {
                    id: state.teamB.player[0],
                    data: state.player[state.teamB.player[0]]
                });
            }
        }
    }

    function leaveGame(playerNumber) {
        console.log('GS change: leaveGame');

        var ia = state.teamA.player.indexOf(playerNumber);
        if (ia > -1) { state.teamA.player.splice(ia, 1); }
        var ib = state.teamB.player.indexOf(playerNumber);
        if (ib > -1) { state.teamB.player.splice(ib, 1); }
        if (playerNumber in state.player) {
            delete state.player[playerNumber];
        }

        dispatch('update');
    }

    function loadCannon(from) {
        console.log('GS change: loadCannon');

        var team = isNaN(from) ? from : getTeam(from);

        switch (team) {
            case 'A':
                state.teamA.cannonLoaded = true;
                break;
            case 'B':
                state.teamB.cannonLoaded = true;
                break;
        }

        dispatch('update');
    }

    function shootCannon(from) {
        console.log('GS change: shootCannon');

        var team = isNaN(from) ? from : getTeam(from);

        switch (team) {
            case 'A':
                state.teamA.shootCannon = true;
                break;
            case 'B':
                state.teamB.shootCannon = true;
                break;
        }

        dispatch('update');

        // reset cannon

        switch (team) {
            case 'A':
                state.teamA.shootCannon = false;
                state.teamA.cannonLoaded = false;
                break;
            case 'B':
                state.teamB.shootCannon = false;
                state.teamB.cannonLoaded = false;
                break;
        }

        dispatch('update');
    }

    // not called directly, that's why the direction is 2nd arg, not data
    function accelerate(from, direction, step) {
        //console.debug('internal acceleration', arguments);
        if (typeof(step) === 'undefined') {
            step = accelerationStep;
        }

        step *= (direction >= 0 ? 1 : -1);
        var minMax = direction >= 0 ? 'min' : 'max';
        var accelerationCmp = direction >= 0 ? accelerationMax : accelerationMin;

        var team = isNaN(from) ? from : getTeam(from);
        switch (team) {
            case 'A':
                if (state.teamA.acceleration < 0 && direction > 0 || state.teamA.acceleration > 0 && direction < 0) {
                    state.teamA.acceleration = 0;
                }
                state.teamA.acceleration = Math[minMax](
                    accelerationCmp,
                    state.teamA.acceleration + step
                );
                break;
            case 'B':
                if (state.teamB.acceleration < 0 && direction > 0 || state.teamB.acceleration > 0 && direction < 0) {
                    state.teamB.acceleration = 0;
                }
                state.teamB.acceleration = Math[minMax](
                    accelerationCmp,
                    state.teamB.acceleration + step
                );
                break;
        }

        dispatch('update');
    }

    function reduceAcceleration() {
        if (state.teamA.acceleration > 0) {
            console.debug('reducing acceleration team A');
            accelerate('A', -1, accelerationStep/2);
        } else if (state.teamA.acceleration < 0) {
            console.debug('reducing acceleration team A');
            accelerate('A', +1, accelerationStep/2);
        }

        if (state.teamB.acceleration > 0) {
            console.debug('reducing acceleration team B');
            accelerate('B', -1, accelerationStep/2);
        } else if (state.teamB.acceleration < 0) {
            console.debug('reducing acceleration team B');
            accelerate('B', +1, accelerationStep/2);
        }
    }

    function startAccelerationTimer() {
        if (accelerationTimer != null) {
            return;
        }

        console.debug('starting acceleration timer');
        accelerationTimer = window.setInterval(
            function() {
                reduceAcceleration();
            },
            accelerationReductionInterval
        );
    }

    return {
        on: on,

        startAction: startAction,
        stopAction: stopAction,
        joinTeam: joinTeam,
        leaveGame: leaveGame,
        loadCannon: loadCannon,
        shootCannon: shootCannon,
        accelerate: function(from, data) {
            //console.debug('acceleration delegator', arguments);
            if (!('direction' in data)) {
                return;
            }

            switch (data.direction) {
                case 'right':
                    accelerate(from, +1);
                    break;
                case 'left':
                    accelerate(from, -1);
                    break;
            }
        },
        startAccelerationTimer: startAccelerationTimer
    };
};
