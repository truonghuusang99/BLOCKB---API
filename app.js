const cors = require("cors");

const express = require("express");
const app = express();

const port = 3000;

const roomController = require("./controller/room");
const floorController = require("./controller/floor");
const windowController = require("./controller/window");
const stairController = require("./controller/stair");
const elevatorController = require("./controller/elevator");
const wallController = require("./controller/wall");
const doorController = require("./controller/door");

app.get("/", (req, res) => {
  res.send("CHAO MUNG DEN VOI BLOCK B");
});
app.get("/floor", cors(), (req, res) => {
  floorController.queryDataFloor(res).then((result) => res.send(result));
});
app.get("/room", cors(), (req, res) => {
  roomController.queryDataRoom(res).then((result) => res.send(result));
});
app.get("/stair", cors(), (req, res) => {
  stairController.queryDataStair().then((result) => res.send(result));
});
app.get("/front-stair-small", cors(), (req, res) => {
  stairController
    .queryDataFrontStair("small")
    .then((result) => res.send(result));
});
app.get("/front-stair-medium", cors(), (req, res) => {
  stairController
    .queryDataFrontStair("medium")
    .then((result) => res.send(result));
});
app.get("/elevator", cors(), (req, res) => {
  elevatorController.queryDataElevator().then((result) => res.send(result));
});
app.get("/wall", cors(), (req, res) => {
  wallController.queryDataWall().then((result) => res.send(result));
});
app.get("/wall-line", cors(), (req, res) => {
  wallController.queryDataWallLine(3).then((result) => res.send(result));
});
app.get("/wall-line-roof", cors(), (req, res) => {
  wallController.queryDataWallLine(2).then((result) => res.send(result));
});

app.get("/window-wc", cors(), (req, res) => {
  windowController.queryDataWindow(0.5).then((result) => res.send(result));
});
app.get("/door-roof", cors(), (req, res) => {
  doorController.queryDataDoor(7).then((result) => res.send(result));
});

app.get("/create", cors(), (req, res) => {
  
});

app.listen(port, () => {
  console.log("SERVER IS ON PORT 3000");
});
