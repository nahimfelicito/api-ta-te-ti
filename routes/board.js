var express = require('express');
var router = express.Router();
var database = require('../database/board-database');

router.get('/',
    async (req, res) => {
        try {
            var connection = await database.connect();
            res.json({
                status: 'success',
                response: "you are in/board"
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error.message
            })
        }
    })


router.route('/:id').get( //send room id in params
    async (req, res) => {
        try {
            var result = await database.get_board(req.params.id);
            res.json({
                status: 'sucess',
                response: result
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error
            })
        }
    })

router.route('/move').put( //send room id, and player id in params
    async (req, res) => {
        try {
            var result = await database.make_a_move(req.body);
            res.json({
                status: 'sucess',
                response: result
            });
        } catch (error) {
            res.json({
                status: 'fail',
                response: error
            })
        }
    })


module.exports = router;