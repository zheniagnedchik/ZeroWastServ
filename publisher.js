var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1883");
var topic = "test123";

client.on("connect", function () {
  setInterval(function () {
    client.publish(topic, "Hello mqtt");
    console.log("Message Sent");
  }, 5000);
});
