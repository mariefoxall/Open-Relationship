"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socket(server);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { sendMessage } = require("./handlers");
// const moment = require("moment");

// const helmet = require("helmet");
// const fs = require("fs");

const PORT = process.env.PORT || 8000;

// const io = socketIO(http);

app.use(express.json());
app.use(morgan("dev"));
// app.use(helmet());
app.use(require("./routes"));

// const currentTime = moment();

io.on("connection", (socket) => {
  socket.emit("connection-message", "hi you are connected");
  socket.on("send chat message", (msg) => {
    console.log("this is the message sent from chat", msg);
    io.emit("push-message-to-conversation", msg);
  });
});

//     console.log("msgDetails", groupId, sender, msg, time);
//     io.emit("receiver-chat-message", { groupId, sender, msg, time });
//   });
// });

// server.on("error", (error) => {
//   console.log("Server error", error);
// });

//TEST
app.get("/bacon", (req, res) =>
  res.status(200).json("I'm sorry, I never want to hear the word '🥓' again.")
);

server.listen(PORT, function () {
  console.info("🌍 Listening on port " + server.address().port);
});

// http.listen(port,() =>{
//   console.log("server is listening on localhost:"+port);
// })
