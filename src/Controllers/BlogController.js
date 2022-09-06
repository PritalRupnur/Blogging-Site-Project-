const { default: mongoose } = require("mongoose")
const BlogModel = require("../Models/BlogModel")
const moment = require('moment')
const today = moment();




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
            return res.status(200).send({status:true, msg:updatedData})
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
          if (isValid == false) return res.send({ msg: "Invalid length of authorId" })

          let verifyauthorId = await BlogModel.findOne({ authorId: authorId })
          if (!verifyauthorId) {
              return res.status(400).send({ status: false, msg: 'No blogs with this authorId exist' })
          }
      }

      if (tags) {
          let verifyTags = await BlogModel.findOne({ tags: tags })
          if (!verifyTags) {
              return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
          }
      }

      if (subcategory) {
          let verifysubcategory = await BlogModel.findOne({ subcategory: subcategory })
          if (!verifysubcategory) {
              return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
          }
      }

      filter = { ...data, ...filter }

      let getSpecificBlogs = await BlogModel.find(filter);

      if (getSpecificBlogs.length == 0) {
          return res.status(400).send({ status: false, data: "No blogs can be found" });
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
             let getSpecificBlogs1 = await BlogModel.findByIdAndUpdate(req.blog_id , { $set: { title: upTitle, body: upBody, isPublished: true, publishedAt: date,  isPublished: true, publishedAt: date }, $push: { "subcategory": upSubCat, "tags": upTags }, new: true });
             res.status(201).send({ data: { getSpecificBlogs1} })
       } }catch (err) {
        res.status(500).send({ status: false, Error: err.message })

    }

}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updatedBlog = updatedBlog;
module.exports.createBlog = createBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogById = deleteBlogById;
