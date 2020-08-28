"use strict";

const express = require("express");
// const http = require("http");
// const path = require("path");
// const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const fs = require("fs");

const PORT = process.env.PORT || 8000;

var app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(require("./routes"));

// io.onconnection("connection", (socket) => {
//   socket.emit("connection-message", { status: "connected" });
//   socket.on("send chat message", (msg) => {
//put msg in database
//   });
// });

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

const server = app.listen(PORT, function () {
  console.info("🌍 Listening on port " + server.address().port);
});
