const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
var dotenv = require('dotenv').config();
var rooms_database = require('./room-database');
const { MyErrorHandler } = require('../error/error_handler')

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const rooms_collection = "rooms";

var connect = async () => {
    console.log('Attempt to connect to boards collection: ', db_host);
    return MongoClient.connect(db_host, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => {
            console.log('Connection error: ', err);
        });
};

var get_board = async (id) => {
    try {
        room = await rooms_database.get_room(id);
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
    room = await rooms_database.get_room(body.room_id); //get the room to use that board
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
        var is_board_complete = checkBoardComplete(room.board); //is it worth it ? because the finished variable
        if(is_board_complete){
            throw new MyErrorHandler("The board is complete")
        }
        room = checkWinner(room, body.move, x_or_o);
        console.log(room.board);
        update = {
            "board": room.board,
            "playing": room.playing,
            "turn": room.turn,
            "finished": room.finished,
            "winner": room.winner,
            "draw": room.draw
        }
        const db = client.db(db_name);
        let collection = db.collection(rooms_collection);
        await collection.updateOne({ _id: body.room_id }, { $set: update });
        room = await rooms_database.get_room(body.room_id);
        console.log(room);
    } catch (error) {
        throw error;
    }
    return room;
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
    turn = room.turn;
    owner_room_id = room.owner_room_id;
    guest_room_id = room.guest_room_id;
    if(!board[move]){ //should go to another function the act of mark? 
        board[move]=mark;
    } else {
        throw new MyErrorHandler("The spot is already occupate it");
    }
    const winner_rows = [ //winner combinations
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winner_rows.length; i++) {
        const [a, b, c] = winner_rows[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            room.winner = mark;
            room.finished = true;
            room.turn = null;
            room.playing = false;
        }
    }
    room.board = board;
    var check_board_complete = checkBoardComplete(board);
    if(check_board_complete){
        room.draw = true;
        room.finished = true;
        room.playing = false;
        room.turn = null;
    }
    if(turn.equals(owner_room_id)){//change turn
        room.turn = guest_room_id;
    } else if (turn.equals(owner_room_id)){
        room.turn = owner_room_id;
    }
    return room;
}



module.exports = {
    get_board: get_board,
    make_a_move: make_a_move
}