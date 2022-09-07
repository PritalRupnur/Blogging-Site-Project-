const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const BlogModel = require("../Models/BlogModel")
const AuthorModel= require("../Models/AuthorModel")
const ObjectId = mongoose.Types.ObjectId;

// const validAuthorid =  async function (req, res, next) {
//     try{
//     let blog = req.body
//     req.auth_ID = blog.authorId
//     let validAuth= ObjectId.isValid(req.auth_ID)
   
// if (validAuth === false) {
//     return res.status(400).send("invalid length of author")
// }
// let result = await AuthorModel.findById({_id:req.auth_ID})
// if(!result){
//     return res.status(400).send("invalid author_id")
// }
// next() }
// catch(err){
//     res.status(500).send({  status: false , Error: err.message })
// }}

// const validBlogID = async function (req, res, next){
// try{
//  req.blog_id = req.params.blogId
 
// let validBlog= ObjectId.isValid(req.blog_id)
// if (validBlog === false) {
//     return res.status(404).send("invalid length of blog")
// }
// let resultBlog = await BlogModel.findById({_id:req.blog_id})
// req.upNeededAuthor = resultBlog.authorId
// if(!resultBlog){
//     return res.status(404).send("invalid blog_id")
// }
// let Blog = await BlogModel.findById({_id: req.blog_id})
 
// next() }
// catch(err){
//     res.status(500).send({  status: false , Error: err.message })
// }

// }


const loginAuthor = async function (req, res) {
    try {
        let Email = req.body.email;
        let Password = req.body.password;

        let Author = await AuthorModel.findOne({ email: Email, password: Password });

        if (!Author)
            return res.send({
                status: false,
                msg: "Email or password is not correct",
            });


        let token = jwt.sign(
            {
                AuthorId: Author._id.toString(),
                batch: "Plutonium",
                group: 3,
            },
            "Project-1"
        );
        res.setHeader("x-api-key", token);
        req.Token = token
        res.status(201).send({ status: true, data: token });
    }
    catch (err) {
        
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

// Updates a blog by changing the its title, body, adding tags, adding a subcategory.
//  (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// Check if the blogId exists (must have isDeleted false). 
// If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document.

module.exports.loginAuthor = loginAuthor