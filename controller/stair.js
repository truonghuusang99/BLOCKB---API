const db = require("../database/config");

module.exports.queryDataStair = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const stair = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright:
          "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        timestamp: "2020-08-27T10:45:03Z",
        features: [],
      };
      await db.mongo.connect();

      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "stair" } })
        .toArray();

      console.log(stair);
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
      //   const face = {
      //     0: "5fd72090a41ba720d866a7dd",
      //     1: " 5fd72090a41ba720d866a7de",
      //     2: "5fd72090a41ba720d866a7df",
      //     3: "5fd72090a41ba720d866a7e0",
      //   };

      //     const location = [
      //       [106.80393830626085, 10.870007597266962, 27],
      //         [106.80395431816578, 10.870028352048328, 27],
      //         [106.80393118411301, 10.870046790632017, 27],
      //         [106.80392020135069, 10.870023401768139, 27],
      //         [106.80393830626085, 10.870007597266962, 27]
      //       ]
      //     const createVal = [];

      //     for (let i = 0; i < location.length; i++) {
      //       createVal.push({
      //         index: i,
      //         id_face: "5fd72090a41ba720d866a7de",
      //         geometry: location[i],
      //       });
      //     }

      //     console.log(createVal);

      //   const create = await database.collection("NODE").insertMany(createVal);
      //   console.log(create);
      resolve(stair);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
