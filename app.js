const cors = require("cors");

const express = require("express");
const app = express();

const port = 3000;

const roomController = require("./controller/room");
const floorController = require("./controller/floor");
const windowController = require("./controller/window");
const stairController = require("./controller/stair");
const elevatorController = require("./controller/elevator");

app.get("/", (req, res) => {
  res.send("CHAO MUNG DEN VOI BLOCK B");
});
app.get("/floor", cors(), (req, res) => {
  floorController.queryDataFloor(res).then((result) => res.send(result));
});
app.get("/room", cors(), (req, res) => {
  roomController.queryDataRoom(res).then((result) => res.send(result));

});
app.get("/window", cors(), (req, res) => {
  res.send("WINDOW API");
});
app.get("/stair", cors(), (req, res) => {
  stairController.queryDataStair().then((result) => res.send(result))
});
app.get("/elevator", cors(), (req, res) => {
  elevatorController.queryDataElevator().then((result) => res.send(result))
});
app.listen(port, () => {
  console.log("SERVER IS ON PORT 3000");
});
