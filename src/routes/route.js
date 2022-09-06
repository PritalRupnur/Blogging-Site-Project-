const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")
const blogController = require("../Controllers/BlogController")
const blogMW = require("../MiddleWare/commonMW")




router.post("/createAuthor", authorController.createAuthor)
router.post("/createBlog", blogMW.validAuthorid, blogController.createBlog)

router.get("/blogs", blogController.getBlogs)
router.put("/blogs/:blogId",blogMW.validBlogID, blogController.updatedBlog)


//router.get("/updatedHC", bookController.updatedHC)
module.exports = router;