const db = require("../database/config");

module.exports.queryDataElevator = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const elevator = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright:
          "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        timestamp: "2020-08-27T10:45:03Z",
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _ELEVATOR_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "elevator" } })
        .toArray();

      for (let i = 0; i < _ELEVATOR_PROP.length; i++) {
        _ELEVATOR_PROP[i]["_id"].toString();
        let feature = {
          type: "Feature",
          properties: _ELEVATOR_PROP[i],
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };
        let face_elevator = await database
          .collection("FACE")
          .findOne({ id_body: _ELEVATOR_PROP[i]._id.toString() });
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: face_elevator._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        elevator["features"].push(feature);
      }

      resolve(elevator);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
