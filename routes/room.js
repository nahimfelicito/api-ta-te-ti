var express = require('express');
var router = express.Router();
var database = require('../database/room-database');

router.get('/',
    async (req, res) => {
        try {
            res.json({
                status: 'success',
                response: "you are in /room"
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error.message
            })
        }
    })


router.route('/create').post( //send in body name of the room
    async (req, res) => {
        try {
            var result = await database.create_room(req.body.name);
            res.json({
                status: 'sucess',
                response: result
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error.message
            })
        }
    })

router.route('/join').post( //send in body id of the room
    async (req, res) => {
        try {
            var result = await database.join_room(req.body.id);
            res.json({
                status: 'sucess',
                response: result
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error.message
            })
        }
    })




module.exports = router;