var GameState = function() {
    var state = {
        counter: 0,
        player: {},
        teamA: [],
        teamB: []
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
        state.counter = 1;
        listener[type] = callback.bind(this);
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
        initPlayer(from);
        state.player[from].actions[data.action] = true;

        dispatch('update');
    }

    function stopAction(from, data) {
        initPlayer(from);
        delete state.player[from].actions[data.action];

        dispatch('update');
    }

    function joinTeam(from, data) {
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
    function increment() {
        state.counter++;

        dispatch('update');
    }

    function decrement() {
        state.counter--;

        dispatch('update');
    }

    return {
        on: on,

        startAction: startAction,
        stopAction: stopAction,
        joinTeam: joinTeam,
        leaveGame: leaveGame,

        /* legacy game */
        increment: increment,
        decrement: decrement
    };
};
