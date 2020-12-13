const db = require("../database/config");

module.exports.queryDataFloor = function () {
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

      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

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
};


