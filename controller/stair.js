const db = require("../database/config");

module.exports.queryDataStair = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const stair = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "stair" } })
        .toArray();

      for (let i = 0; i < _STAIR_PROP.length; i++) {
        _STAIR_PROP[i]["_id"].toString();
        let feature = {
          type: "Feature",
          properties: _STAIR_PROP[i],
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };
        let faceStair = await database
          .collection("FACE")
          .findOne({ id_body: _STAIR_PROP[i]._id.toString() });
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceStair._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        stair["features"].push(feature);
      }
      resolve(stair);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.queryDataFrontStair = function (height) {
  return new Promise(async (resolve, rejects) => {
    try {
      const frontStair = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database.collection("BODY").findOne({
        "graphic:type": { $eq: "front-stair" },
        "graphic:height": { $eq: height },
      });
      _STAIR_PROP["_id"].toString();
      let faceStair = await database
        .collection("FACE")
        .find({ id_body: _STAIR_PROP._id.toString() })
        .toArray();

      for (let i = 0; i < faceStair.length; i++) {
        let feature = {
          type: "Feature",
          properties: _STAIR_PROP,
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };

        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceStair[i]._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        frontStair["features"].push(feature);
      }
      resolve(frontStair);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.createDataStair = function (arr, properties) {
  return new Promise(async (resolve, rejects) => {
    await db.mongo.connect();
    const database = await db.mongo.db("block_b");
    const create = await database.collection("BODY").insertOne(properties);

    for (let i = 0; i < arr.length; i++) {
      const createFace = await database
        .collection("FACE")
        .insertOne({ id_body: create.insertedId.toString() });
      this.createStairNode(
        createFace.insertedId.toString(),
        arr[i].geometry.coordinates[0]
      );
    }

    resolve("Success");
  });
};

module.exports.createStairNode = async function (id_face, locationArr) {
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
  } catch (error) {
    throw error;
  }
};
