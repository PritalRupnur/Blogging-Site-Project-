const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")
const blogController = require("../Controllers/BlogController")
const blogMW = require("../MiddleWare/commonMW")




router.post("/authors", authorController.createAuthor)

router.post("/blogs",blogController.createBlog)

router.get("/blogs", blogController.getBlogs)

router.put("/blogs/:blogId", blogController.updatedBlog)

router.delete("/blogs", blogController.deleteBlog)

router.delete("/blogs/:blogId", blogController.deleteBlogById)
router.post("/login",blogMW.loginAuthor)



module.exports = router;