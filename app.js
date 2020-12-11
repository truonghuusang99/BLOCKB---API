const { MongoClient } = require('mongodb');
const cors = require('cors');

const express = require('express');
const app = express();

const port = 3000;
const urlDB = 'mongodb://localhost:27017/BANDO'
const mongo = new MongoClient(urlDB)

//init variable
const floor = {
    type: "FeatureCollection",
    generator: "overpass-ide",
    copyright: "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
    timestamp: "2020-08-27T10:45:03Z",
    features: []
}
const room = {
    type: "FeatureCollection",
    generator: "overpass-ide",
    copyright: "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
    timestamp: "2020-08-27T10:45:03Z",
    features: []
}

// FUNCTION QUERY

async function queryDataFloor() {
    try {
        await mongo.connect()
        console.log("Connected correctly to server");
        const database = await mongo.db("block_b")

        const _FLOOR_PROP = await database.collection("Body").find({ type: { $eq: "floor" } }).toArray()
        _FLOOR_PROP.forEach(async floorProp => {
            let feature = {
                type: "Feature",
                properties: floorProp,
                geometry: {
                    type: "Polygon",
                    coordinates: []
                }
            }
            let faceFloor = await database.collection("Face").findOne({ id_floor_room: floorProp._id.toString() })
            // tìm tọa độ
            let geometries = await (await database.collection("Node").find({ id_face: faceFloor._id.toString() }).sort(['index'], 1).toArray()).map(item => item.geometry)
            feature['geometry']['coordinates'].push(geometries)

            floor['features'].push(feature)
        })

    } catch (err) {
        throw err
    } finally {
        //await mongo.close(true)
    }
}

async function queryDataRoom() {
    try {
        
    } catch (error) {
        
    } finally {

    }
}

queryDataFloor();
queryDataRoom();

app.get("/", (req, res) => {
    res.send("CHAO MUNG DEN VOI BLOCK B")
})
app.get("/floor", cors(), (req, res) => {
    res.send(floor)
})
app.get("/room", cors(), (req, res) => {
    res.send(room)
})
app.listen(port, () => {
    console.log("SERVER IS ON PORT 3000")
})







