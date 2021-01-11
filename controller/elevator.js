const db = require("../database/config");

module.exports.queryDataElevator = function () {
  return new Promise(async (resolve, rejects) => {
    try {
      const floor = {
        type: "FeatureCollection",
        copyright: "Gi Cung Duoc Group",
        timestamp: new Date(),
        features: [],
      };

      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      const _STAIR_PROP = await database
        .collection("BODY")
        .find({ "graphic:type": { $eq: "elevator" } })
        .toArray();
      for (let i = 0; i < _STAIR_PROP.length; i++) {
        _STAIR_PROP[i]["_id"].toString();
        let faceFloor = await database
          .collection("FACE")
          .find({ id_body: _STAIR_PROP[i]._id.toString() }).toArray();

        let feature = {
          type: "Feature",
          properties: _STAIR_PROP[i],
          geometry: {
            type: faceFloor.length > 1 ? "MultiPolygon" : "Polygon",
            coordinates: [],
          },
        };
        for (let face of faceFloor) {
          // tìm tọa độ
          let geometries = await (
            await database
              .collection("NODE")
              .find({ id_face: face._id.toString() })
              .sort(["index"], 1)
              .toArray()
          ).map((item) => {
            return [item.x, item.y, item.z]
          });
          feature["geometry"]["coordinates"].push(geometries);
        }
        floor["features"].push(feature);
      }
      resolve(floor);
    } catch (err) {
      resolve({ error: err });
      throw err;
    }
  });
};
module.exports.createElevator = function (properties, geometry) {
  return new Promise(async (resolve, rejects) => {
    try {
      await db.mongo.connect();
      const database = await db.mongo.db("block_b");

      // create body 
      const body = await database.collection("BODY").insertOne(properties)

      for (let i in geometry) {
        let face = await database.collection("FACE").insertOne({ id_body: body.insertedId.toString() })

        let geo = geometry[i].map((item, index) => { return { x: item[0], y: item[1], z: item[2], index, id_face: face.insertedId.toString() } })
        await database.collection("NODE").insertMany(geo)
      }
      resolve({ id_body: body.insertedId })
    } catch (err) {
      resolve(err)
    }
  })
}
module.exports.deleteElevator = function (id_body) {
  return new Promise(async (resolve, rejects) => {
    try {
      await db.mongo.connect()
      const database = await db.mongo.db("block_b");
      await database.collection("BODY").deleteOne({ _id: ObjectId(id_body) })
      const face = await database
        .collection("FACE")
        .find({ id_body: id_body.toString() }).toArray();
      for (let faceItem of face) {
        await database.collection("NODE").deleteMany({ id_face: faceItem._id.toString() })
        await database.collection("FACE").deleteOne({ _id: faceItem._id })
      }
      resolve("Success")
    } catch (error) {
      rejects(err)
    }
  })
}

