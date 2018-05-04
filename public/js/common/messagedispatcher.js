var MessageDispatcher = function(air_console){

    var debounceTimeout = 250;
    var messageCallbacks = {};
    var sendDebounce = false;
    var broadcastDebounce = false;

    function register(messageName, callback) {
        messageCallbacks[messageName] = callback;
    }

    function send(messageName, data) {
        if (sendDebounce !== false) {
            return;
        }

        sendDebounce = setTimeout(function(){
            console.log("sending message " + messageName +" to screen");
            air_console.message(
                AirConsole.SCREEN,
                {
                    name: messageName,
                    data: data
                }
            );
            sendDebounce = false;
        }, debounceTimeout);
    }

    function broadcast(messageName, data) {
        broadcastDebounce = setTimeout(function(){
            console.log("broadcasting message " + messageName);
            air_console.broadcast(
                {
                    name: messageName,
                    data: data
                }
            );
            broadcastDebounce = false;
        }, debounceTimeout);
    }

    // Listen for messages
    air_console.onMessage = function(from, data) {
        if (!('name' in data)) {
            console.debug('unknown message', data);
            return;
        }

        if (!(data.name in messageCallbacks)) {
            console.debug('no callback registered for ' + data.name, data);
            return;
        }

        messageCallbacks[data.name](from, data.data);
    };

    return {
        register: register,
        send: send,
        broadcast: broadcast
    };

};
