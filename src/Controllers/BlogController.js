const { default: mongoose } = require("mongoose")
const BlogModel = require("../Models/BlogModel")
const AuthorModel = require("../Models/AuthorModel")
const moment = require('moment')



//==============================================================createBlog=========================================================================

const createBlog = async function (req, res) {
    try {

        let { title, body, authorId, category, isPublished } = req.body

        if (!title) {
            return res.status(400).send({ status: false, message: "title is not present" })
        }
        if (typeof (title) != "string") {
            return res.status(400).send({ status: false, message: "title should be in String" })
        }
        if (!body) {
            return res.status(400).send({ status: false, message: "body is not present" })
        }
        if (typeof (body) != "string") {
            return res.status(400).send({ status: false, message: "body should be in String" })
        }
        if (!authorId) {
            return res.status(400).send({ status: false, message: "AuthorID is not present" })
        }
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ status: false, message: "authorId is invalid" })
        }
        if (!category) {
            return res.status(400).send({ status: false, message: "category is not present" })
        }
        if (typeof (category) != "string") {
            return res.status(400).send({ status: false, message: "category should be in String" })
        }

        let validId = await AuthorModel.findOne({ _id: authorId })
        if (!validId) {
            return res.status(404).send({ status: false, message: " AuthorId not found" })
        }

        if (typeof (isPublished) != "boolean") {
            return res.status(400).send({ status: false, message: "isPublished should be false or true" })
        }

        if (isPublished == true) { req.body.publishedAt = moment().format() }

        let blogCreated = await BlogModel.create(req.body)
        res.status(201).send({ status: true, message: blogCreated })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//=============================================================getBlogs=============================================================================

// Returns all blogs in the collection that aren't deleted and are published
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter blogs list by applying filters. Query param can have any combination of below filters.
// By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2


const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        let filter = {
            isdeleted: false,
            isPublished: true,
        };

        const { category, subcategory, tags, authorId } = data

        if (category) {
            let verifyCategory = await BlogModel.findOne({ category: category })
            if (!verifyCategory) {
                return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
            }
        }
        if (authorId) {
            let isValid = mongoose.Types.ObjectId.isValid(authorId)
            if (isValid == false) return res.status(400).send({ status: false, msg: "Invalid  authorId" })

            let verifyauthorId = await BlogModel.findOne({ authorId: authorId })
            if (!verifyauthorId) {
                return res.status(400).send({ status: false, msg: 'No blogs with this authorId exist' })
            }
        }
        if (tags) {
            let verifyTags = await BlogModel.findOne({ tags: tags })
            if (!verifyTags) {
                return res.status(400).send({ status: false, msg: 'No blogs with this tags exist' })
            }
        }
        if (subcategory) {
            let verifysubcategory = await BlogModel.findOne({ subcategory: subcategory })
            if (!verifysubcategory) {
                return res.status(400).send({ status: false, msg: 'No blogs with this subcategory exist' })
            }
        }

        let filter1 = { ...data, ...filter }

        let getSpecificBlogs = await BlogModel.find(filter1);
        if (getSpecificBlogs.length == 0) {
            return res.status(404).send({ status: false, data: "No blogs can be found" });
        }
        else {
            console.log(getSpecificBlogs.length)
            return res.status(200).send({ status: true, data: getSpecificBlogs });
        }
    }
    catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

//===============================================================updateBlog======================================================================
// Updates a blog by changing the its title, body, adding tags, adding a subcategory.
// (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// Check if the blogId exists (must have isDeleted false). 
// If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document.


const updatedBlog = async function (req, res) {
    try {
        let data = req.body
        const { title, body, tags, subcategory } = data
        let date = moment().format();

        let blogId = req.params.blogId
        let savedData = await BlogModel.findById({ _id: blogId })
        if (!savedData) {
            return res.status(404).send({ status: false, msg: "invalid blogId" })
        }

        if (req.authorLoggedIn.authorId != savedData.authorId) { res.status(400).send({ status: false, msg: "unauthorised author" }) }
        if (!savedData.isDeleted) {
            if (savedData.isPublished == true) {
                let getSpecificBlogs = await BlogModel.findByIdAndUpdate(blogId, { $set: { title: title, body: body }, $push: { "subcategory": subcategory, "tags": tags } }, { new: true });
                res.status(201).send({ status: false, data: { getSpecificBlogs } })
            }
            else if (savedData.isPublished == false) {
                let getSpecificBlogs1 = await BlogModel.findByIdAndUpdate(blogId, { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { "subcategory": subcategory, "tags": tags } }, { new: true });
                res.status(201).send({ status: true, data: { getSpecificBlogs1 } })
            }
        }
        else {
            res.status(400).send({ status: false, msg: "data is deleted already" })
        }
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//====================================================================deleteBlogparams=================================================================
// Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this


const deleteBlogById = async function (req, res) {
    try {
        let blogId = req.params.blogId

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send({ status: false, msg: `${blogId} is invalid` })
        }
        let savedData = await BlogModel.findOne({ _id: blogId, isDeleted: false })
        
        if (!savedData) {
            return res.status(404).send({ status: false, msg: "This blog has been deleted already" })
        } else {
            if (req.authorLoggedIn.authorId != savedData.authorId) { res.status(400).send({ status: false, msg: "unauthorised author" }) }

            let updatedData = await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
            return res.status(200).send({ status: true, msg: updatedData })
        }
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
}


//===========================================================deleteBlogQueryParams===================================================================
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this


let deleteBlog = async function (req, res) {

    try {
        let data = req.query

        if (Object.keys(data).length == 0) {

            return res.status(400).send({ status: false, msg: "Blog details is mandatory" })
        }

        let filter = { isDeleted: false, isPublished: false }

        if (data["authorId"]) {
            if (!mongoose.Types.ObjectId.isValid(data["authorId"])) {

                return res.status(400).send({ status: false, msg: "authorId is not valid" })
            }

            filter["authorId"] = data["authorId"]

            if (req.authorLoggedIn.authorId != filter["authorId"]) { 
                return res.status(400).send({ status: false, msg: "unauthorised author" }) 
            }

        } else {
            
            filter["authorId"] = req.authorLoggedIn.authorId
            
        }

        if (data["category"]) {

            filter["category"] = data["category"]
        }

        if (data["tags"]) {

            filter["tags"] = data["tags"]
        }
        if (data["subcategory"]) {

            filter["subcategory"] = data["subcategory"]
        }

        let savedData = await BlogModel.updateMany(filter, { isDeleted: true },)

        if (savedData.modifiedCount == 0) {

            return res.status(404).send({ status: false, msg: "No document found" })
        }

        res.status(200).send({ status: true, msg: savedData });
    }
    catch (error) {

        res.status(500).send({ status: false, msg: error.message });
    }
}



module.exports = { createBlog, getBlogs, updatedBlog, deleteBlog, deleteBlogById }

