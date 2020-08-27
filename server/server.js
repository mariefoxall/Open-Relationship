"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const fs = require("fs");

const PORT = process.env.PORT || 8000;

var app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(require("./routes"));

app.use("/static", express.static("./uploads"));

//TEST
app.get("/bacon", (req, res) =>
  res.status(200).json("I'm sorry, I never want to hear the word '🥓' again.")
);

app.post("/uploadFile", upload.single("avatar"), (req, res) => {
  let fileType = req.file.mimetype.split("/")[1];
  let oldFileName = `./uploads/${req.file.filename}`;
  let newFileName = "./uploads/" + req.file.filename + "." + fileType;
  fs.rename(oldFileName, newFileName, function () {
    console.log("callback");
  });
  res
    .status(200)
    .json({
      status: 200,
      imageLocation: newFileName,
      message: "image successfully uploaded!",
    });
});

const server = app.listen(PORT, function () {
  console.info("🌍 Listening on port " + server.address().port);
});
