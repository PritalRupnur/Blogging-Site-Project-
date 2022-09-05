const mongoose = require('mongoose');

const BlogModel = require("../Models/BlogModel")
const AuthorModel= require("../Models/AuthorModel")
const ObjectId = mongoose.Types.ObjectId;

const validAuthorid =  async function (req, res, next) {
    try{
    let blog = req.body
    let auth_ID = blog.authorId


   let validAuth= ObjectId.isValid(auth_ID)
   
if (validAuth === false) {
    
    return res.status(400).send("invalid lenght of author")
}

let result = await AuthorModel.findById({_id:auth_ID})
if(!result){
    return res.status(400).send("invalid author_id")


}
next() }
catch(err){
    res.status(500).send({  status: false , Error: err.message })

}}

module.exports.validAuthorid = validAuthorid;