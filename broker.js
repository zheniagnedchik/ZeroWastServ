const aedes = require("aedes")();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mqtt = require("mqtt");
const Item = require("./models/Item");
const server = require("net").createServer(aedes.handle);
const ws = require("ws");
const PORTLISTEN = process.env.PORT || 3000;
const portWs = process.env.PORT + 1 || 3002;

const port = 1883;
const { mongoUrl, cookieKey } = require("./keys");
const cors = require("./middleware/cors.middleware");
const client = mqtt.connect("mqtt://192.168.100.8:1883");
const topic = "test123";

const wss = new ws.Server(
  {
    port: portWs,
  },
  () => console.log("serverStarted")
);

app.use(cors);
let socket;
wss.on("connection", function connection(ws) {
  socket = ws;
});

client.on("message", (topic, message) => {
  message = message.toString();
  const item = new Item({ mess: message });
  item.save();
  if (socket) {
    socket.send(message);
  }
});

client.on("connect", () => {
  client.subscribe(topic);
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://user:1234@cluster0.1tll05y.mongodb.net/item?retryWrites=true&w=majority"
    );
    mongoose.connection.on("connected", () => {
      console.log("connected to mongo");
    });
    app.listen(PORTLISTEN, () => {
      console.log("Application listening on port 3333!");
    });
    server.listen(port, function () {
      console.log(`MQTT Broker started on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};
app.get("/", async (req, res) => {
  res.send("test");
});
app.get("/getItems", async (req, res) => {
  console.log(res);
  const items = await Item.find({});
  res.send(items);
});
start();
