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


const getBlog = async function (req, res) {
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
    
  

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;