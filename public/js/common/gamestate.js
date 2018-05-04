var GameState = function() {
    var state = {
        counter: 0,
        player: {}
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
            actions: {}
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

        /* legacy game */
        increment: increment,
        decrement: decrement
    };
};