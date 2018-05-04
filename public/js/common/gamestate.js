var GameState = function() {
    var state = {
        counter: 0
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
        increment: increment,
        decrement: decrement
    };
};
