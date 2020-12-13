const cors = require("cors");

const express = require("express");
const app = express();

const port = 3000;

const roomController = require("./controller/room");
const floorController = require("./controller/floor");

app.get("/", (req, res) => {
  res.send("CHAO MUNG DEN VOI BLOCK B");
});
app.get("/floor", cors(), (req, res) => {
  floorController.queryDataFloor(res).then((result) => res.send(result));
});
app.get("/room", cors(), (req, res) => {
  roomController.queryDataRoom(res).then((result) => res.send(result));
});
app.listen(port, () => {
  console.log("SERVER IS ON PORT 3000");
});
