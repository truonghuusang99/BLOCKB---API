const { ObjectId } = require("mongodb");
const db = require("../database/config");
module.exports.queryDataRoom = function (res) {
  return new Promise(async (resolve, rejects) => {
    try {
      const room = {
        type: "FeatureCollection",
        generator: "overpass-ide",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
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

module.exports.createRoom = async function (room) {
  try {
    let arrRoom = [];
    const database = await db.mongo.db("block_b");
    for (let i = 0; i < room.length; i++) {
      const create = await database
        .collection("BODY")
        .insertOne(room[i].properties);

      const createFace = await database
        .collection("FACE")
        .insertOne({ id_body: create.insertedId.toString() });
      console.log(createFace.insertedId);
      this.createRoomNode(
        createFace.insertedId.toString(),
        room[i].geometry.coordinates[0]
      );
    }
  } catch (err) {
    throw err;
  }
};

module.exports.deleteRoom = async function (id_body) {
  try {
    const database = await db.mongo.db("block_b");

    const face = await database
      .collection("FACE")
      .findOne({ id_body: id_body.toString() });

    await database
      .collection("NODE")
      .deleteMany({ id_face: face._id.toString() });
    await database
      .collection("FACE")
      .deleteOne({ id_body: id_body.toString() });
    await database.collection("BODY").deleteOne({ _id: ObjectId(id_body) });
  } catch (err) {
    throw err;
  }
};
