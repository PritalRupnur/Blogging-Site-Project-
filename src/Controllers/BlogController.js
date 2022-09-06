const BlogModel = require("../Models/BlogModel")
const mongoose = require('mongoose');
const moment = require('moment')

const today = moment();

const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let blogCreated = await BlogModel.create(blog)
        res.send({ data: blogCreated })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }

}


const getBlogs = async function (req, res) {
    try {
        let Authid = req.query.authorId
        let data = req.query;

        let filter = {
            isdeleted: false,
            isPublished: true,

        };

        const { category, subcategory, tags } = data

        if (category) {
            let verifyCategory = await BlogModel.findOne({ category: category })
            if (!verifyCategory) {
                return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
            }
        }

        if (tags) {

            if (!await BlogModel.exists(tags)) {
                return res.status(400).send({ status: false, msg: 'no blog with this tags exist' })
            }
        }

        if (subcategory) {

            if (!await BlogModel.exists(subcategory)) {
                return res.status(400).send({ status: false, msg: 'no blog with this subcategory exist' })
            }
        }

        let getSpecificBlogs = await BlogModel.find({ _id: Authid }, { filter });

        if (getSpecificBlogs.length == 0) {
            return res.status(400).send({ status: false, data: "No blogs can be found" });
        }
        else {
            return res.status(200).send({ status: true, data: getSpecificBlogs });
        }
    }
    catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

// Updates a blog by changing the its title, body, adding tags, adding a subcategory.
//  (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// Check if the blogId exists (must have isDeleted false). 
// If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document.

const updatedBlog = async function (req, res) {

    try {
        
          
        let updation = req.body
        let upTitle = updation.title
        let upBody = updation.body
        let upSubCat = updation.subcategory
        let upTags = updation.tags
        let date = today.format();
        console.log(req.blog_id)
        let publishStatus = await BlogModel.findById({ _id: req.blog_id });
        console.log(publishStatus.isPublished)
        console.log(upTitle);

        if (publishStatus.isPublished && !publishStatus.isDeleted) {


            let getSpecificBlogs = await BlogModel.findByIdAndUpdate( req.blog_id,{ $set: { title: upTitle, body: upBody },$push: { "subcategory": upSubCat, "tags": upTags }, new: true });
            res.status(201).send({ data: { getSpecificBlogs} })
        }

        else {

             let getSpecificBlogs1 = await BlogModel.findByIdAndUpdate(req.blog_id, { $set: { title: upTitle, body: upBody, isPublished: true, publishedAt: date,  isPublished: true, publishedAt: date }, $push: { "subcategory": upSubCat, "tags": upTags }, new: true });
          

             res.status(201).send({ data: { getSpecificBlogs1} })
       } }catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }


}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updatedBlog = updatedBlog;