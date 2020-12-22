const db = require("../database/config");

module.exports.queryDataWindow = function (height) {
  return new Promise(async (resolve, rejects) => {
    try {
      const frontWindow = {
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
        "graphic:type": { $eq: "window" },
        "graphic:height": { $eq: 0.5 },
      });
      console.log(_WALL_PROP);
      _WALL_PROP["_id"].toString();
      let faceWindow = await database
        .collection("FACE")
        .find({ id_surface: _WALL_PROP._id.toString() })
        .toArray();

      for (let i = 0; i < faceWindow.length; i++) {
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceWindow[i]._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);
        console.log(geometries);
        frontWindow["features"][0]["geometry"]["coordinates"].push(geometries);
      }
      frontWindow["features"][0]["properties"] = _WALL_PROP;
      resolve(frontWindow);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.createDataWindow = function (arr, properties) {
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
