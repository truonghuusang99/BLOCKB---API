const db = require("../database/config");
module.exports.queryDataWallLine = function (height) {
  return new Promise(async (resolve, rejects) => {
    try {
      const floor = {
        type: "FeatureCollection",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };

      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database
        .collection("SURFACE")
        .find({
          "graphic:type": { $eq: "wall-line" },
          "graphic:height": { $eq: height },
        })
        .toArray();
      for (let i = 0; i < _STAIR_PROP.length; i++) {
        _STAIR_PROP[i]["_id"].toString();
        let faceFloor = await database
          .collection("FACE")
          .find({ id_surface: _STAIR_PROP[i]._id.toString() }).toArray();

        let feature = {
          type: "Feature",
          properties: _STAIR_PROP[i],
          geometry: {
            type: faceFloor.length > 1 ? "MultiLineString" : "LineString",
            coordinates: [],
          },
        };
        for (let face of faceFloor) {
          // tìm tọa độ
          let geometries = await (
            await database
              .collection("NODE")
              .find({ id_face: face._id.toString() })
              .sort(["index"], 1)
              .toArray()
          ).map((item) => {
            return [item.x, item.y, item.z]
          });
          feature["geometry"]["coordinates"].push(geometries);
        }
        floor["features"].push(feature);
      }
      resolve(floor);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
module.exports.queryDataWall = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const floor = {
        type: "FeatureCollection",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };

      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database
        .collection("SURFACE")
        .find({ "graphic:type": { $eq: "wall" } })
        .toArray();
      for (let i = 0; i < _STAIR_PROP.length; i++) {
        _STAIR_PROP[i]["_id"].toString();
        let faceFloor = await database
          .collection("FACE")
          .find({ id_surface: _STAIR_PROP[i]._id.toString() }).toArray();

        let feature = {
          type: "Feature",
          properties: _STAIR_PROP[i],
          geometry: {
            type: faceFloor.length > 1 ? "MultiLineString" : "LineString",
            coordinates: [],
          },
        };
        for (let face of faceFloor) {
          // tìm tọa độ
          let geometries = await (
            await database
              .collection("NODE")
              .find({ id_face: face._id.toString() })
              .sort(["index"], 1)
              .toArray()
          ).map((item) => {
            return [item.x, item.y, item.z]
          });
          feature["geometry"]["coordinates"].push(geometries);
        }
        floor["features"].push(feature);
      }
      resolve(floor);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
module.exports.createWall = function (properties, geometry) {
  return new Promise(async (resolve, rejects) => {
    try {
      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      // create body 
      const body = await database.collection("SURFACE").insertOne(properties)

      for (let i in geometry) {
        let face = await database.collection("FACE").insertOne({ id_surface: body.insertedId.toString() })

        let geo = geometry[i].map((item, index) => { return { x: item[0], y: item[1], z: item[2], index, id_face: face.insertedId.toString() } })
        await database.collection("NODE").insertMany(geo)
      }
      resolve({ id_surface: body.insertedId })
    } catch (err) {
      resolve(err)
    }
  })
}
module.exports.deleteWall = function (id_surface) {
  return new Promise(async (resolve, rejects) => {
    try {
      await db.mongo.connect()
      const database = await db.mongo.db("block_b");
      await database.collection("SURFACE").deleteOne({ _id: id_surface })
      const face = await database
        .collection("FACE")
        .find({ id_surface: id_surface.toString() }).toArray();
      for (let faceItem of face) {
        await database.collection("NODE").deleteMany({ id_face: faceItem._id.toString() })
        await database.collection("FACE").deleteOne({ _id: faceItem._id })
      }
      resolve("Success")
    } catch (error) {
      rejects(error)
    }
  })
}
