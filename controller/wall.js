const db = require("../database/config");
module.exports.queryDataWallLine = function (height) {
  return new Promise(async (resolve, rejects) => {
    try {
      const wallLine = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "MultiLineString",
              coordinates: [],
            },
          },
        ],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _WALL_PROP = await database.collection("SURFACE").findOne({
        "graphic:type": { $eq: "wall-line" },
        "graphic:height": { $eq: height },
      });
      let faceWall = await database
        .collection("FACE")
        .find({ id_surface: _WALL_PROP._id.toString() })
        .toArray();
      for (let i = 0; i < faceWall.length; i++) {
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceWall[i]._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        wallLine["features"][0]["geometry"]["coordinates"].push(geometries);
      }
      wallLine["features"][0]["properties"] = _WALL_PROP;
      resolve(wallLine);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
module.exports.queryDataWall = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const frontWall = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "MultiLineString",
              coordinates: [],
            },
          },
        ],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _WALL_PROP = await database.collection("SURFACE").findOne({
        "graphic:type": { $eq: "wall" },
      });

      _WALL_PROP["_id"].toString();
      let faceWall = await database
        .collection("FACE")
        .find({ id_surface: _WALL_PROP._id.toString() })
        .toArray();

      for (let i = 0; i < faceWall.length; i++) {
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceWall[i]._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        frontWall["features"][0]["geometry"]["coordinates"].push(geometries);
      }
      frontWall["features"][0]["properties"] = _WALL_PROP;
      resolve(frontWall);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
module.exports.createDataWall = function (arr, properties) {
  return new Promise(async (resolve, rejects) => {
    await db.mongo.connect();
    console.log(properties);
    const database = await db.mongo.db("block_b");
    const create = await database.collection("SURFACE").insertOne(properties);

    for (let i = 0; i < arr.length; i++) {
      const createFace = await database
        .collection("FACE")
        .insertOne({ id_surface: create.insertedId.toString() });
      console.log(createFace.insertedId);
      this.createWallNode(createFace.insertedId.toString(), arr[i]);
    }

    resolve("Success");
  });
};

module.exports.createWallNode = async function (id_face, locationArr) {
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
