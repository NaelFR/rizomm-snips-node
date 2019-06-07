var mqtt = require('mqtt');
var say = require('say');

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
            if (intent.slots[0]) {
                console.log("J'allume la lumière dans " + intent.slots[0].value.value);
                say.speak("J'allume la lumière dans " + intent.slots[0].value.value);
                break;
            }
            say.speak("Je n'ai pas compris où dois-je allumer la lumière ?");
            break;
        case 'naelABC:lightTurnOff':
            if (intent.slots[0]) {
                console.log("J'éteins la lumière " + intent.slots[0].value.value);
                say.speak("J'éteins la lumière dans " + intent.slots[0].value.value);
                break;
            }
            say.speak("Je n'ai pas compris où dois-je éteindre la lumière ?");
            break;
        default:
            console.log("Je n'ai pas compris");
            say.speak("Je ne suis pas sûr d'avoir bien compris !");

    }
}

function onHotwordDetected() {
    console.log("[Snips Log] Hotword detected");
    say.speak("Oui ?");
}

function onListeningStateChanged(listening) {
    console.log("[Snips Log] " + (listening ? "Start" : "Stop") + " listening");
}
