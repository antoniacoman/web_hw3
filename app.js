const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storate: 'homework.db'
})

const Student = sequelize.define('student', {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    age: Sequelize.INTEGER
}, {
    timestamps: false
})

const app = express()
app.use(bodyParser.json())

app.get('/create', async (req, res) => {
    try {
        await sequelize.sync({force: true})
        for (let i = 0; i < 10; i++) {
            const student = new Student({
                name: 'name ' + i,
                address: 'some address on ' + i + 'th street',
                age: 30 + i
            })
            await student.save()
        }
        res.status(201).json({message: 'created'})
    } catch (err) {
        console.warn(err.stack)
        res.status(500).json({message: 'server error'})
    }
})

app.get('/students', async (req, res) => {
    try {
        const students = await Student.findAll()
        res.status(200).json(students)
    } catch (err) {
        console.warn(err.stack)
        res.status(500).json({message: 'server error'})
    }
})

app.post('/students', async (req, res) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0) {
            res.status(400).json({message: "body is missing"})
        } else if (!body.name || !body.address || !body.age) {
            res.status(400).json({message: "malformed request"})
        } else if (body.age < 0) {
            res.status(400).json({message: "age should be a positive number"})
        } else {
            await Student.create(body);
            res.status(201).json({message: "created"})
        }
    } catch (err) {
        console.warn(err.stack)
        res.status(500).json({message: 'server error'})
    }
})

module.exports = app
