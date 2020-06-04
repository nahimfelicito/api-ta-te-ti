const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var dotenv = require('dotenv').config();
var rooms = require('./room-database');
const { MyErrorHandler } = require('../error/error_handler')

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
        if (!room) {
            throw new MyErrorHandler("The board you specified has no room asociate it")
        }
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
    return room.board;
}

var make_a_move = async (body) => {
    if (!body.room_id) {
        throw new MyErrorHandler("You must specify a room id");
    }
    if (!body.user_id) {
        throw new MyErrorHandler("You must specify a user id");
    }
    if (!body.move || body.move < 0 || body.move > 8) {
        throw new MyErrorHandler("You must specify a valid move, valid moves are from 0 to 8");
    }
    room = await rooms.get_room(body.room_id); //get the room to use that board
    if (!room.playing) {
        throw new MyErrorHandler("No one has join the room yet");
    }
    if (room.finished) {
        throw new MyErrorHandler("The game is finished");
    }
    if (room.turn != body.user_id) {
        throw new MyErrorHandler("It is not your turn");
    }
    client = await connect();
    if (!client) {
        return;
    }
    try {
        var x_or_o = '';
        if (body.user_id == room.owner_room_id) {
            x_or_o = 'X';
        } else if (body.user_id == room.guest_room_id) {
            x_or_o = 'O';
        } else {
            throw new MyErrorHandler("The player id provided does not belong to any of the player of this room");
        }
        var is_board_complete = await checkBoardComplete(room.board); //is it worth it ? because the finished variable
        if(is_board_complete){
            throw new MyErrorHandler("The board is complete")
        }
        var winner = checkWinner(room, body.move, x_or_o);
        //update collection room 
        //return new board or room
    } catch (error) {
        throw error;
    }
}

function checkBoardComplete(board) {
    var complete = true;
    board.forEach(element => {
        if (element != 'X' && element != 'O') {
            complete = false;
        }
    });
    return complete;
}

function checkWinner(room, move, x_or_o){
    board = room.board;
    mark = x_or_o;
    if(!board[move]){
        board[move]=mark;
    } else {
        throw new MyErrorHandler("The spot is already occupate it");
    }
    //check if is draw, or is a winner, change turn
    //return the updated room 
}



module.exports = {
    get_board: get_board,
    make_a_move: make_a_move
}