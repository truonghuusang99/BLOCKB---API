const db = require("../database/config");
module.exports.queryDataDoor = function (height) {
  return new Promise(async (resolve, rejects) => {
    try {
      const door = {
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

      const _DOOR_PROP = await database.collection("SURFACE").findOne({
        "graphic:type": { $eq: "door" },
        "graphic:height": { $eq: height },
      });
      let faceWall = await database
        .collection("FACE")
        .find({ id_surface: _DOOR_PROP._id.toString() })
        .toArray();
      for (let i = 0; i < faceWall.length; i++) {
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceWall[i]._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        door["features"][0]["geometry"]["coordinates"].push(geometries);
      }
      door["features"][0]["properties"] = _DOOR_PROP;
      resolve(door);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
