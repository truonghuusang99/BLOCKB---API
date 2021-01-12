const db = require("../database/config");

module.exports.queryDataWindow = function (type, height = null) {
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
          "graphic:type": { $eq: type },
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
            type: "MultiLineString",
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

module.exports.queryDataWindowLine = function (type, height = null) {
  return new Promise(async (resolve, rejects) => {
    try {
      const Window = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _WINDOW_PROP = await database
        .collection("SURFACE")
        .find(
          height != null
            ? {
              "graphic:type": { $eq: type },
              "graphic:height": { $eq: height },
            }
            : {
              "graphic:type": { $eq: type },
            }
        )
        .toArray();

      for (let i = 0; i < _WINDOW_PROP.length; i++) {
        let faceWindow = await database
          .collection("FACE")
          .find({ id_surface: _WINDOW_PROP[i]._id.toString() })
          .toArray();

        let feature = {
          type: "Feature",
          properties: _WINDOW_PROP[i],
          geometry: {
            type: "MultiLineString",
            coordinates: [],
          },
        };
        for (let j = 0; j < faceWindow.length; j++) {
          // tìm tọa độ
          let geometries = await (
            await database
              .collection("NODE")
              .find({ id_face: faceWindow[j]._id.toString() })
              .sort(["index"], 1)
              .toArray()
          ).map((item) => item.geometry);

          feature["geometry"]["coordinates"] = geometries;
        }
        Window["features"].push(feature);
      }

      resolve(Window);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.queryDataWindowStairLine = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const WindowStairLine = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _WINDOWSTAIRLINE_PROP = await database
        .collection("SURFACE")
        .find({
          "graphic:type": { $eq: "window-stair-line" },
        })
        .toArray();

      for (let i = 0; i < _WINDOWSTAIRLINE_PROP.length; i++) {
        let faceWindow = await database
          .collection("FACE")
          .find({ id_surface: _WINDOWSTAIRLINE_PROP[i]._id.toString() })
          .toArray();

        let feature = {
          type: "Feature",
          properties: _WINDOWSTAIRLINE_PROP[i],
          geometry: {
            type: "MultiLineString",
            coordinates: [],
          },
        };
        for (let j = 0; j < faceWindow.length; j++) {
          // tìm tọa độ
          let geometries = await (
            await database
              .collection("NODE")
              .find({ id_face: faceWindow[j]._id.toString() })
              .sort(["index"], 1)
              .toArray()
          ).map((item) => item.geometry);

          feature["geometry"]["coordinates"].push(geometries);
        }
        WindowStairLine["features"].push(feature);
      }

      resolve(WindowStairLine);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.createWindow = function (properties, geometry) {
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
module.exports.deleteWindow = function (id_surface) {
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

module.exports.delete = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      await db.mongo.connect()
      const database = await db.mongo.db("block_b");
      const surface = await database.collection("SURFACE").find({ "graphic:type": "window-line"}).toArray()
      for (let i of surface) {
        await database.collection("SURFACE").deleteOne({ _id: i._id })
        const face = await database
          .collection("FACE")
          .find({ id_surface: i._id.toString() }).toArray();
        for (let faceItem of face) {
          await database.collection("NODE").deleteMany({ id_face: faceItem._id.toString() })
          await database.collection("FACE").deleteOne({ _id: faceItem._id })
        }
      }

      resolve("Success")
    } catch (error) {
      rejects(error)
    }
  })
}