var GameState = function() {
    var accelerationStep = 10;
    var accelerationMin = -75;
    var accelerationMax = 75;
    var accelerationTimer = null;
    var accelerationReductionInterval = 750;

    var state = {
        player: {},
        teamA: {
            player: [],
            acceleration: 0,
            cannonLoaded: false
        },
        teamB: {
            player: [],
            acceleration: 0,
            cannonLoaded: false
        }
    };

    var listener = {};

    function dispatch(type) {
        for (var i in listener) {
            if (listener.hasOwnProperty(i) && type === i) {
                listener[type](state);
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
            team: ''
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
        if (data.team === 'A') {
            state.teamA.player.push(from);
        }
        if (data.team === 'B') {
            state.teamB.player.push(from);
        }

        dispatch('update');
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

    // not called directly, that's why the direction is 2nd arg, not data
    function accelerate(from, direction, step) {
        if (typeof(step) === 'undefined') {
            step = accelerationStep;
        }

        step *= (direction >= 0 ? 1 : -1);
        var minMax = direction >= 0 ? 'min' : 'max';

        var team = isNaN(from) ? from : getTeam(from);
        switch (team) {
            case 'A':
                state.teamA.acceleration = Math[minMax](
                    accelerationMax,
                    state.teamA.acceleration + step
                );
                break;
            case 'B':
                state.teamB.acceleration = Math[minMax](
                    accelerationMax,
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
        accelerate: function(from, data) {
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
