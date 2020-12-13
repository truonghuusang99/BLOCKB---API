const { ObjectId } = require("mongodb");
const db = require("../database/config");
module.exports.queryDataRoom = function (res) {
  return new Promise(async (resolve, rejects) => {
    try {
      const room = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright:
          "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        timestamp: "2020-08-27T10:45:03Z",
        features: [],
      };

      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      const _ROOM_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "room" } })
        .toArray();      

      for (let i = 0; i < _ROOM_PROP.length; i++) {
        _ROOM_PROP[i]["_id"].toString();
        let feature = {
          type: "Feature",
          properties: _ROOM_PROP[i],
          geometry: {
            type: "Polygon",
            coordinates: [],
          },
        };
        let faceroom = await database
          .collection("FACE")
          .findOne({ id_body: _ROOM_PROP[i]._id.toString() });
        // tìm tọa độ
        let geometries = await (
          await database
            .collection("NODE")
            .find({ id_face: faceroom._id.toString() })
            .sort(["index"], 1)
            .toArray()
        ).map((item) => item.geometry);

        feature["geometry"]["coordinates"].push(geometries);
        room["features"].push(feature);
      }

      resolve(room);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};

module.exports.createRoomNode = async function (id_face, locationArr) {
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
