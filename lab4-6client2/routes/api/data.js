const express = require('express')
const router = express.Router()

const { check, validationResult } = require('express-validator')


const Data = require('../../models/Data')

// @route   POST api/data
// @desc    Create a data
// @access  Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newData = new Data({
            name: `CLIENT 2: ${req.body.name}`
        })

        const data = await newData.save()
        res.json(data)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Client 2 Error')
    }
})

router.get('/', async (req, res) => {
    try {
        const datas = await Data.find().sort({
            date: -1
        })
        res.json(datas)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Client 2 Error')
    }
})

// @route   Delete api/data
// @desc    Delete a data
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id)

        if (!data) {
            return res.status(404).json({ msg: 'Data not found' })
        }

        await data.remove()

        res.send({ msg: 'Data removed' })
    } catch (e) {
        console.error(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Data not found' })
        }
        res.status(500).send('CLIENT 2 Error')
    }
})

// @route   PUT api/data/:id
// @desc    Change Data by Id
// @access  Public
router.put('/:id', [
    check('name', 'Name is required')
        .not()
        .isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const data = await Data.findById(req.params.id)

        data.name = `CLIENT 2: ${req.body.name}`

        await data.save()

        res.json(data)
    } catch (e) {
        console.error(e.message)

        // Check if the data exist
        if (e.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Data does not exist' })
        }

        res.status(500).send('CLIENT 2 Error')
    }
})


module.exports = router