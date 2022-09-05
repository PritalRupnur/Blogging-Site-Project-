const BlogModel = require("../Models/BlogModel")
const mongoose = require('mongoose');
const createBlog = async function (req, res) {
    try{
        let blog = req.body
        let blogCreated = await BlogModel.create(blog)
        res.send({ data: blogCreated })

    } catch(err){
        res.status(500).send({  status: false , Error: err.message })
    
    }
   
}

module.exports.createBlog = createBlog;