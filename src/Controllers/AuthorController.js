const AuthorModel = require("../Models/AuthorModel")
// const mongoose = require('mongoose');

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let Email = author.email
        let Password = author.password
        if(!Email){
            res.status(400).send({ msg: "valid EmailID required" })
        }
        if(!Password){
            res.status(400).send({ msg: "valid password required" })

        }

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ data: authorCreated })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }
}

const getAuthorsData = async function (req, res) {
    try {
        let authors = await AuthorModel.find()
        res.send({ data: authors })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }

}

module.exports.createAuthor = createAuthor
module.exports.getAuthorsData = getAuthorsData
