const BlogModel = require("../Models/BlogModel")
const mongoose = require('mongoose');
const createBlog = async function (req, res) {
    let blog = req.body
    let blogCreated = await BlogModel.create(blog)
    res.send({ data: blogCreated })
}

module.exports.createBlog = createBlog;