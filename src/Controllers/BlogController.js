const { default: mongoose } = require("mongoose")
const BlogModel = require("../Models/BlogModel")
// const mongoose = require('mongoose');

const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let blogCreated = await BlogModel.create(blog)
        res.status(201).send({ data: blogCreated })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }

}



const deleteBlogById = async function (req, res) {
    try {
        let data = req.params.blogId
        let savedData = await BlogModel.findOne({ _id: data, isDeleted: false })
        if (!savedData) {
            return res.status(404).send({ status: false, msg: "This blog is deleted already" })
        } else {
            let updatedData = await BlogModel.findByIdAndUpdate({ _id: data }, { isDeleted: true }, { new: true })
            return res.status(200).send()
        }
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
}

 


const deleteBlog = async function (req, res) {
    try {
        let data = req.query
        let filter = { isDeleted: false, isPublished: true }
        if (data["authorId"]) {
            if (!mongoose.Types.ObjectId.isValid(data["authorId"])) {
                return res.send({ status: false, msg: "authorId is invalid" })
            }
            filter["authorId"] = data["authorId"]
        }
        if (data["category"]) {
            filter["category"] = data["category"]
        }
        if (data["subcategory"]) {
            filter["subcategory"] = data["subcategory"]
        }
        if (data["tags"]) {
            filter["tags"] = data["tags"]
        }
        let savedData = await BlogModel.updateMany(filter, { isDeleted: true })
        if (savedData.modifiedCount == 0) {
            return res.status(404).send({ status: false, msg: "No document found" })

        }
        res.status(200).send({ status: true, msg: savedData })
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
}



module.exports.createBlog = createBlog;
// module.exports.getBlogs = getBlogs; 
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogById = deleteBlogById;