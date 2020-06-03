const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var dotenv = require('dotenv').config();
var rooms = require('./room-database');
const {MyErrorHandler} = require('../error/error_handler')

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;

var connect = async () => {
    console.log('Attempt to connect to boards collection: ', db_host);
    return MongoClient.connect(db_host, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => {
            console.log('Connection error: ', err);
        });
};

var get_board = async (id) => {
    try {
        room = await rooms.get_room(id);
        console.log(room);
        if(!room){
            throw new MyErrorHandler("The board you specified has no room asociate it")
        }
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
    return room.board ;
}

var make_a_move = async (body) => {

}

module.exports = {
    get_board: get_board,
    make_a_move: make_a_move
}