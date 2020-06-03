const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var dotenv = require('dotenv').config();
var players = require('./player-database');
const {MyErrorHandler} = require('../error/error_handler');


const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const collection_name = 'rooms';

var connect = async () => {
    console.log('Attempt to connect to rooms collection: ', db_host);
    return MongoClient.connect(db_host, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => {
            console.log('Connection error: ', err);
        });
};

var create_room = async (name) => { //recieve room name, creates a player and board
    if(!name){
        throw new MyErrorHandler("You must specify one name for your room");
    }
    var player = await players.create_player();
    //create player owner
    client = await connect();
    if (!client) {
        return;
    }
    try {
        const db = client.db(db_name);
        let collection = db.collection(collection_name);
        room = {
            "room_name": name,
            "board": ["", "", "", "", "", "", "", "", ""],
            "owner_room_id": player._id,
            "guest_room_id": null,
            "playing": false,
            "is_owner_turn": true,
            "finished": false,
            "winner": null,
            "draw": false
        }
        let result = await collection.insertOne(room);
        return result.ops[0];
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
}

var join_room = async (id) => { //searches for the room, check if it is avialable to play, creates new player, and updates the room
    if(!id){
        throw new MyErrorHandler("You must specify an id room to join")
    }
    var room = await get_room(id);
    if(room.guest_room_id || room.playing || room.finished ){
        throw new MyErrorHandler("This room is not suitable to join, please try another one.")
    }
    var player = await players.create_player();
    client = await connect();
    if (!client) {
        return;
    }
    try {
        const db = client.db(db_name);
        let collection = db.collection(collection_name);
        update = {
            guest_room_id: player._id,
            playing: true,
        }
        await collection.updateOne({ _id: room._id }, { $set: update });
        room = await get_room(id);
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
    return room;
}

var get_room = async (id) => {
    if(!id){
        throw new MyErrorHandler("You must specify an id for search the room")
    }
    var room;
    client = await connect();
    if (!client) {
        return room;
    }
    try {
        const db = client.db(db_name);
        let collection = db.collection(collection_name);
        room = await collection.findOne({ _id: new mongo.ObjectID(id) });
        if (!room || room === undefined) {
            throw new MyErrorHandler("The room does not exist");
        }
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
    return room;
}

module.exports = {
    create_room: create_room,
    join_room: join_room,
    get_room: get_room
}