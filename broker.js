// const aedes = require("aedes")();
// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const httpServer = require("http").createServer();
// const mqtt = require("mqtt");
// const Item = require("./models/Item");
// const server = require("net").createServer(aedes.handle);
// const ws = require("ws");

// const PORTLISTEN = process.env.PORT || 3000;
// const portWs = 8000;
// const port = 1883;

// const portMQ = 8888;
// const { mongoUrl, cookieKey } = require("./keys");

// const client = mqtt.connect("mqtt://192.168.100.8:1883");
// const topic = "test123";

// ;
// let socket;
// // wss.on("connection", function connection(ws) {
// //   socket = ws;
// // });

// client.on("message", (topic, message) => {
//   message = message.toString();
//   const item = new Item({ mess: message });
//   item.save();
//   if (socket) {
//     socket.send(message);
//   }
// });

// client.on("connect", () => {
//   client.subscribe(topic);
// });
// const wss = new ws.Server(
//   {
//     port: 8000,
//   },
//   () => console.log("serverStarted")
// );
// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     message = JSON.parse(message);
//     console.log(message);
//     wss.clients.forEach((client) => {
//       client.send(
//         JSON.stringify({
//           ...message,
//           new: true,
//           id: Date.now(),
//           time: Date.now(),
//         })
//       );
//     });
//   });
// });
// const start = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://user:1234@cluster0.1tll05y.mongodb.net/item?retryWrites=true&w=majority"
//     );
//     mongoose.connection.on("connected", () => {
//       console.log("connected to mongo");
//     });
//     app.listen(PORTLISTEN, () => {
//       console.log("Application listening on port 3333!");
//     });
//     server.listen(port, function () {
//       console.log(`MQTT Broker started on port ${port}`);
//     });
//     httpServer.listen(portMQ, function () {
//       console.log("websocket server listening on port ", portMQ);
//     });
//     httpServer.on;
//   } catch (e) {
//     console.log(e);
//   }
// };
// app.get("/", async (req, res) => {
//   res.send("test");
// });
// app.get("/getItems", async (req, res) => {
//   console.log(res);
//   const items = await Item.find({});
//   res.send(items);
// });
// start();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("ws");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const Item = require("./models/Item");
const cors = require("./middleware/cors.middleware");

const wss = new Server({ server });
app.use(cors);
wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    message = JSON.parse(message);

    if (message.event === "update") {
      const test = await Item.findByIdAndUpdate(
        { _id: message._id },
        { $push: { item: message.item }, $set: { weight: message.item.weight } }
      );
      if (test) {
        await wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              ...message,
              new: true,
              id: Date.now(),
              time: Date.now(),
            })
          );
        });
      }
    }
    if (message.event === "clearCache") {
      const clearCache = await Item.findByIdAndUpdate(
        { _id: message._id },
        { $set: { item: [] } }
      );
      if (clearCache) {
        await wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              ...message,
              new: true,
              id: Date.now(),
              time: Date.now(),
            })
          );
        });
      }
    }
    // switch (message.event) {
    //   case "update":
    //     console.log("pl");
    //     wss.clients.forEach((client) => {
    //       client.send(
    //         JSON.stringify({
    //           ...message,
    //           new: true,
    //           id: Date.now(),
    //           time: Date.now(),
    //         })
    //       );
    //     });
    //   default:
    //     console.log("ok");
    // }
  });
});

app.get("/", (req, res) => {
  res.send(`<h1>lsdkfdek ${PORT}</h1> `);
});

server.listen(PORT, () => {
  console.log("listening on *:3000");
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://user:1234@cluster0.1tll05y.mongodb.net/item?retryWrites=true&w=majority"
    );
    mongoose.connection.on("connected", () => {
      console.log("connected to mongo");
    });

    // app.listen(PORTLISTEN, () => {
    //   console.log("Application listening on port 3333!");
    // });
    // server.listen(port, function () {
    //   console.log(`MQTT Broker started on port ${port}`);
    // });
    // httpServer.listen(portMQ, function () {
    //   console.log("websocket server listening on port ", portMQ);
    // });
    // httpServer.on;
  } catch (e) {
    console.log(e);
  }
};

app.get("/getItems", async (req, res) => {
  console.log(res);
  const items = await Item.find({});
  res.send(items);
});
start();
