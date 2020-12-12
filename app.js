const { MongoClient } = require("mongodb");
const cors = require("cors");

const express = require("express");
const app = express();

const port = 3000;
const urlDB = "mongodb://localhost:27017/localhost";
const mongo = new MongoClient(urlDB, { useUnifiedTopology: true });

// FUNCTION QUERY

function queryDataFloor() {
  return new Promise(async (resolve, rejects) => {
    try {
      const floor = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright:
          "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        timestamp: "2020-08-27T10:45:03Z",
        features: [],
      };

      await mongo.connect();
      console.log("Connected correctly to server");
      const database = await mongo.db("block_b");

      const _FLOOR_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "floor" } })
        .toArray();
      for (let i = 0; i < _FLOOR_PROP.length; i++) {
        _FLOOR_PROP[i]["_id"].toString();
        let feature = {
          type: "Feature",
          properties: _FLOOR_PROP[i],
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };
        let faceFloor = await database
          .collection("FACE")
          .findOne({ id_body: _FLOOR_PROP[i]._id.toString() });
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceFloor._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        floor["features"].push(feature);
      }
      resolve(floor);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
}

function queryDataRoom(res) {
  return new Promise(async (resolve, rejects) => {
    try {
      const room = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright:
          "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        timestamp: "2020-08-27T10:45:03Z",
        features: [],
      };

      await mongo.connect();
      console.log("Connected correctly to server");
      const database = await mongo.db("block_b");

      const _ROOM_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "room" } })
        .toArray();
      for (let i = 0; i < _ROOM_PROP.length; i++) {
        _ROOM_PROP[i]["_id"].toString();
        let feature = {
          type: "Feature",
          properties: _ROOM_PROP[i],
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };
        let faceroom = await database
          .collection("FACE")
          .findOne({ id_body: _ROOM_PROP[i]._id.toString() });
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceroom._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        room["features"].push(feature);
      }

      resolve(room);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
}

app.get("/", (req, res) => {
  res.send("CHAO MUNG DEN VOI BLOCK B");
});
app.get("/floor", cors(), (req, res) => {
  queryDataFloor(res).then(result => res.send(result))
});
app.get("/room", cors(), (req, res) => {
  queryDataRoom(res).then(result => res.send(result));
});
app.listen(port, () => {
  console.log("SERVER IS ON PORT 3000");
});
