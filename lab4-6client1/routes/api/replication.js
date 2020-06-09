const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('config')

const { check, validationResult } = require('express-validator')


const Data = require('../../models/Data')

// @route   GET api/replication
// @desc    Replicate data from Head server
// @access  Public
router.get('/', async (req, res) => {
    try {
        const headPort = config.get('serverPort')

        const options = {
            uri: `http://localhost:${headPort}/api/data`,
            method: 'GET'
        }

        request(options, async (error, response, body) => {
            try {
                if (error) {
                    console.error(error)
                }

                if (response.statusCode !== 200) {
                    return res.status(404).json({
                        msg: `Server with port ${headPort} not found`
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
                    msg: `Client with port ${headPort} not found`
                })
            }
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Client 1 Error')
    }
})


module.exports = router