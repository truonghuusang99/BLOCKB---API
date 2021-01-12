const { ObjectId } = require("mongodb");
const db = require("../database/config");
module.exports.queryDataLine = function (type, height = null) {
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
                .collection("SURFACE")
                .find({
                    "graphic:type": { $eq: type }
                })
                .toArray();

            for (let i = 0; i < _STAIR_PROP.length; i++) {
                _STAIR_PROP[i]["_id"].toString();
                let faceFloor = await database
                    .collection("FACE")
                    .find({ id_surface: _STAIR_PROP[i]._id.toString() }).toArray();

                let feature = {
                    type: "Feature",
                    properties: _STAIR_PROP[i],
                    geometry: {
                        type: "MultiLineString",
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
module.exports.createLine = function (properties, geometry) {
    return new Promise(async (resolve, rejects) => {
        try {
            await db.mongo.connect();
            const database = await db.mongo.db("block_b");
            // create body 
            const body = await database.collection("SURFACE").insertOne(properties)

            for (let i = 0; i < geometry.length; i++) {

                let face = await database.collection("FACE").insertOne({ id_surface: body.insertedId.toString() })

                let geo = geometry[i].map((item, index) => { return { x: item[0], y: item[1], z: item[2], index, id_face: face.insertedId.toString() } })

                await database.collection("NODE").insertMany(geo)
            }
            resolve({ id_surface: body.insertedId })
        } catch (err) {
            resolve(err)
        }
    })
}
module.exports.deleteLine = function (id_surface) {
    return new Promise(async (resolve, rejects) => {
        try {
            await db.mongo.connect()
            const database = await db.mongo.db("block_b");
            await database.collection("SURFACE").deleteOne({ _id: id_surface })
            const face = await database
                .collection("FACE")
                .find({ id_surface: id_surface.toString() }).toArray();
            for (let faceItem of face) {
                await database.collection("NODE").deleteMany({ id_face: faceItem._id.toString() })
                await database.collection("FACE").deleteOne({ _id: faceItem._id })
            }
            resolve("Success")
        } catch (error) {
            rejects(error)
        }
    })
}