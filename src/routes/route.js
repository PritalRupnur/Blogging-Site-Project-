const express = require('express');
const router = express.Router();
const authorController = require("../Controllers/AuthorController");
const blogController = require("../Controllers/BlogController");
const blogMW = require("../MiddleWare/commonMW");


router.post("/authors", authorController.createAuthors);

router.post("/blogs", blogMW.authentication,  blogController.createBlogs);

router.get("/blogs",blogMW.authentication, blogController.getBlogs);

router.post("/login", authorController.loginAuthors);


router.put("/blogs/:blogId",blogMW.authentication,  blogController.updatedBlogs);

router.delete("/blogs/:blogId",blogMW.authentication,  blogController.deleteBlogById);

router.delete("/blogs",blogMW.authentication, blogController.deleteBlog);


module.exports = router;





