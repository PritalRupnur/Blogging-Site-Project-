const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")
const blogController = require("../Controllers/BlogController")
const blogMW = require("../MiddleWare/commonMW")




router.post("/author", authorController.createAuthor)

router.post("/blogs", blogMW.validAuthorid, blogController.createBlog)

router.get("/blogs", blogController.getBlogs)

router.put("/blogs/:blogId",blogMW.validBlogID, blogController.updatedBlog)

router.delete("/blogs", blogController.deleteBlog)

router.delete("/blogs/:blogId", blogController.deleteBlogById)



module.exports = router;