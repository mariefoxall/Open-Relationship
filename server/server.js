"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const PORT = process.env.PORT || 8000;

var app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(require("./routes"));

//TEST
app.get("/bacon", (req, res) =>
  res.status(200).json("I'm sorry, I never want to hear the word '🥓' again.")
);

const server = app.listen(PORT, function () {
  console.info("🌍 Listening on port " + server.address().port);
});
