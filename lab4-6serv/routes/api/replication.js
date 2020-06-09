const express = require('express')
const router = express.Router()
const request = require('request')
const logger = require('logops')

const { check, validationResult } = require('express-validator')


const Data = require('../../models/Data')

// @route   GET api/replication/:port
// @desc    Replicate data from client by Client's port
// @access  Public
router.get('/:port', async (req, res) => {
    logger.info('Request: %s: %s', req.method, req.url);

    try {
        const clientPort = req.params.port

        const options = {
            uri: `http://localhost:${clientPort}/api/data`,
            method: 'GET'
        }

        request(options, async (error, response, body) => {
            try {
                if (error) {
                    console.error(error)
                }

                if (response.statusCode !== 200) {
                    return res.status(404).json({
                        msg: `Client with port ${clientPort} not found`
                    })
                }

                const dataFromClient = JSON.parse(body)
                let datas = await Data.find().sort({
                    date: -1
                })

                const updatedData = dataFromClient.filter(el => {


                    return datas.filter(d => {
                        return d.name === el.name
                            && new Date(d.date).getTime() === new Date(el.date).getTime()
                    }).length === 0
                })

                updatedData.forEach(async el => {
                    const newData = new Data({
                        name: el.name,
                        date: new Date(el.date)
                    })

                    await newData.save()
                })
                res.json([...datas, ...updatedData])
            } catch (err) {
                console.error(err)
                return res.status(404).json({
                    msg: `Client with port ${clientPort} not found`
                })
            }
        })
        // const newData = new Data({
        //     name: `CLIENT 1: ${req.body.name}`
        // })

        // const data = await newData.save()
        // res.json(data)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router