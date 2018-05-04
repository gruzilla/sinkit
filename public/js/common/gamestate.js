var GameState = function() {
    var state = {
        counter: 0,
        player: {},
        teamA: [],
        teamB: [],
        accelerationA: 0,
        accelerationB: 0
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
        if (state.teamA.indexOf(from) > -1) return 'A';
        if (state.teamB.indexOf(from) > -1) return 'B';
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
            state.teamA.push(from);
        }
        if (data.team === 'B') {
            state.teamB.push(from);
        }

        dispatch('update');
    }

    function leaveGame(playerNumber) {
        console.log('GS change: leaveGame');

        var ia = state.teamA.indexOf(playerNumber);
        if (ia > -1) { state.teamA.splice(ia, 1); }
        var ib = state.teamB.indexOf(playerNumber);
        if (ib > -1) { state.teamB.splice(ib, 1); }
        if (playerNumber in state.player) {
            delete state.player[playerNumber];
        }

        dispatch('update');
    }

    /* legacy +- game */
    function accelerateRight(from) {
        switch (getTeam(from)) {
            case 'A':
                state.accelerationA++;
                break;
            case 'B':
                state.accelerationB++;
                break;
        }

        dispatch('update');
    }

    function accelerateLeft(from) {
        switch (getTeam(from)) {
            case 'A':
                state.accelerationA--;
                break;
            case 'B':
                state.accelerationB--;
                break;
        }

        dispatch('update');
    }

    return {
        on: on,

        startAction: startAction,
        stopAction: stopAction,
        joinTeam: joinTeam,
        leaveGame: leaveGame,

        accelerateRight: accelerateRight,
        accelerateLeft: accelerateLeft
    };
};
