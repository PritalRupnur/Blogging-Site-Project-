const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")
const blogController = require("../Controllers/BlogController")




router.post("/createAuthor", authorController.createAuthor)
router.post("/createBlog", blogController.createBlog)


//router.get("/updatedHC", bookController.updatedHC)
module.exports = router;