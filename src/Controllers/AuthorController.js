const AuthorModel= require("../Models/AuthorModel")
const mongoose = require('mongoose');

const createAuthor= async function (req, res) {try{

    let author = req.body
    let authorCreated = await AuthorModel.create(author)
    res.status(200).send({data: authorCreated})
}catch(err){
    res.status(500).send({  status: false , Error: err.message })

}
   
}

const getAuthorsData= async function (req, res) {
    try{
        let authors = await AuthorModel.find()
        res.send({data: authors})
    }
    catch(err){
        res.status(500).send({  status: false , Error: err.message })
    
    }
   
}

module.exports.createAuthor= createAuthor
module.exports.getAuthorsData= getAuthorsData
