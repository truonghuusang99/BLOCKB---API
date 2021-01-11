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
const { ObjectId } = require("mongodb");

// const temp = 
app.get("/api", (req, res) => {
  res.send("<h1>CHÀO MỪNG BẠN ĐẾN VỚI TÒA NHÀ B UIT</h1> <a href='https://ibb.co/4S3cWpB'><img src='https://i.ibb.co/M1Qbn7q/back.png' alt='back' border='0'></a><a href='https://ibb.co/Lxy3tzs'><img src='https://i.ibb.co/m9K3qCP/front.png' alt='front' border='0'></a>");
});
app.get("/api/floor", cors(), (req, res) => {
  floorController.queryDataFloor().then((result) => res.send(result));
  // let promise = []
  // for (let i in temp) {
  //   promise.push(
  //     floorController.createFloor(temp[i].properties, temp[i].geometry.coordinates)
  //   )
  // }
  // Promise.all(promise).then(result => res.send(result))
  //roomController.deleteRoom("5ffc751666c33e1778ba9e33").then((result) => res.send(result));
});
app.get("/api/room", cors(), (req, res) => {
  roomController.queryDataRoom().then((result) => res.send(result));
});
app.get("/api/stair", cors(), (req, res) => {
  stairController.queryDataStair().then((result) => res.send(result));
});
app.get("/api/front-stair-small", cors(), (req, res) => {
  stairController
    .queryDataFrontStair("small")
    .then((result) => res.send(result));
});
app.get("/api/front-stair-medium", cors(), (req, res) => {
  stairController
    .queryDataFrontStair("medium")
    .then((result) => res.send(result));
});
app.get("/api/elevator", cors(), (req, res) => {
  elevatorController.queryDataElevator().then((result) => res.send(result));
});
app.get("/api/wall", cors(), (req, res) => {
  wallController.queryDataWall().then((result) => res.send(result));
});
app.get("/api/wall-line", cors(), (req, res) => {
  wallController.queryDataWallLine(3).then((result) => res.send(result));
});
app.get("/api/wall-line-roof", cors(), (req, res) => {
  wallController.queryDataWallLine(2).then((result) => res.send(result));
});

app.get("/api/window-wc", cors(), (req, res) => {
  // let promise = []
  // for (let i in temp) {
  //   promise.push(
  //     windowController.createWindow(temp[i].properties, temp[i].geometry.coordinates)
  //   )
  // }
  // Promise.all(promise).then(result => res.send(result))
  windowController
    .queryDataWindow("window", 0.5)
    .then((result) => res.send(result));
});
// app.get("/api/window-room01", cors(), (req, res) => {
//   windowController
//     .queryDataWindow("window", 3)
//     .then((result) => res.send(result));
// });
app.get("/api/window-room", cors(), (req, res) => {
  windowController
    .queryDataWindow("window", 7)
    .then((result) => res.send(result));
});
// app.get("/api/window-line", cors(), (req, res) => {
//   windowController
//     .queryDataWindowLine("window-line")
//     .then((result) => res.send(result));
// });
// app.get("/api/window-sub-wc", cors(), (req, res) => {
//   windowController
//     .queryDataWindow("window", 1.5)
//     .then((result) => res.send(result));
// });
// app.get("/api/window-stair", cors(), (req, res) => {
//   windowController
//     .queryDataWindow("window-stair")
//     .then((result) => res.send(result));
// });
// app.get("/api/window-stair-line", cors(), (req, res) => {
//   windowController
//     .queryDataWindowStairLine()
//     .then((result) => res.send(result));
// });

// app.get("/api/door-roof", cors(), (req, res) => {
//   doorController.queryDataDoor(7).then((result) => res.send(result));
// });
// app.get("/api/door-roof-line", cors(), (req, res) => {
//   windowController
//     .queryDataWindowLine("door-line")
//     .then((result) => res.send(result));
// });

app.listen(port, () => {
  console.log("SERVER IS ON PORT 3000");
});
