const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
//var players = require('./players-repository')
var dotenv = require('dotenv').config();
const shortid = require('shortid');

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const collection_name = 'players';

var connect = async () => {
    console.log('Attempt to connect to players collection: ', db_host);
    return MongoClient.connect(db_host, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => {
            console.log('Connection error: ', err);
        });
};

var create_player = async () => {
    client = await connect();
    if (!client) {
        return;
    }
    try {
        let id =  shortid.generate();
        var player = {
            "id": id
        };
        const db = client.db(db_name);
        let collection = db.collection(collection_name);
        let result = await collection.insertOne(player);
        return result.ops[0];
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
}



module.exports = {
    create_player: create_player
}