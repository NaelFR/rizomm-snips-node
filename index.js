var mqtt = require('mqtt');

var hostname = "mqtt://raspberrypi.local";
var client  = mqtt.connect(hostname);

client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + hostname);
    client.subscribe('hermes/#');
});

client.on('message', function (topic, message) {
    if (topic === "hermes/asr/startListening") {
        onListeningStateChanged(true);
    } else if (topic === "hermes/asr/stopListening") {
        onListeningStateChanged(false);
    } else if (topic.match(/hermes\/hotword\/.+\/detected/g) !== null) {
        onHotwordDetected()
    } else if (topic.match(/hermes\/intent\/.+/g) !== null) {
        onIntentDetected(JSON.parse(message));
    }
});

function onIntentDetected(intent) {
    console.log("[Snips Log] Intent detected");
    switch (intent.intent.intentName) {
        case 'naelABC:lightTurnOn':
            console.log("J'allume la lumière de " + intent.slots[0].value.value);
            break;
        case 'naelABC:lightTurnOff':
            console.log("J'éteins la lumière " + intent.slots[0].value.value);
            break;
        default:
            console.log("Je n'ai pas compris");

    }
}

function onHotwordDetected() {
    console.log("[Snips Log] Hotword detected");
}

function onListeningStateChanged(listening) {
    console.log("[Snips Log] " + (listening ? "Start" : "Stop") + " listening");
}
