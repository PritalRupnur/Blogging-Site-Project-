const BlogModel = require("../Models/BlogModel")
const mongoose = require('mongoose');

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

        let getSpecificBlogs = await BlogModel.find({_id:Authid},{filter});

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


module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;