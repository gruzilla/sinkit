var MessageDispatcher = function(air_console){

    var broadCastTimeout = 250;
    var sendTimeout = 100;
    var messageCallbacks = {};
    var sendDebounce = false;
    var broadcastDebounce = false;

    function register(messageName, callback) {
        messageCallbacks[messageName] = callback;
    }

    function send(messageName, data, to){
        if (typeof(to) === 'undefined') {
            to = AirConsole.SCREEN;
        }
        console.log('sending message ' + messageName + ' to ' + to);
        air_console.message(
            to,
            {
                name: messageName,
                data: data
            }
        );
    }

    function sendDebounced(messageName, data, to) {
        if (sendDebounce !== false) {
            return;
        }

        sendDebounce = setTimeout(function() {
            send(messageName, data, to);
            sendDebounce = false;
        }, sendTimeout);
    }

    function broadcast(messageName, data) {
        if (broadcastDebounce !== false) {
            return;
        }

        broadcastDebounce = setTimeout(function(){
            console.log("broadcasting message " + messageName);
            air_console.broadcast(
                {
                    name: messageName,
                    data: data
                }
            );
            broadcastDebounce = false;
        }, broadCastTimeout);
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

        console.debug('received message ' + data.name + ' from ' + from);
        messageCallbacks[data.name](from, data.data);
    };

    return {
        register: register,
        send: send,
        sendDebounced: sendDebounced,
        broadcast: broadcast
    };

};
