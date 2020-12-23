const db = require("../database/config");

module.exports.queryDataWindow = function (type, height = null) {
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
          console.log(geometries);
          feature["geometry"]["coordinates"].push(geometries);
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
          console.log(geometries);
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

module.exports.createMultiWindow = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    this.createDataWindow([arr[i].geometry.coordinates], arr[i].properties);
  }
};

module.exports.createDataWindow = function (arr, properties) {
  return new Promise(async (resolve, rejects) => {
    await db.mongo.connect();
    const database = await db.mongo.db("block_b");
    const create = await database.collection("SURFACE").insertOne(properties);

    for (let i = 0; i < arr.length; i++) {
      const createFace = await database
        .collection("FACE")
        .insertOne({ id_surface: create.insertedId.toString() });
      this.createWindowNode(createFace.insertedId.toString(), arr[i]);
    }

    resolve("Success");
  });
};

module.exports.createWindowNode = async function (id_face, locationArr) {
  try {
    let arrayCreate = [];
    for (let i = 0; i < locationArr.length; i++) {
      arrayCreate.push({
        id_face,
        index: i,
        geometry: locationArr[i],
      });
    }

    const database = await db.mongo.db("block_b");
    const create = await database.collection("NODE").insertMany(arrayCreate);
    console.log(create);
  } catch (error) {
    throw error;
  }
};
