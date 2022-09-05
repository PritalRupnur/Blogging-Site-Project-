const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")
const blogController = require("../Controllers/BlogController")
const blogMW = require("../MiddleWare/commonMW")




router.post("/createAuthor", authorController.createAuthor)
router.post("/createBlog", blogMW.validAuthorid, blogController.createBlog)



module.exports = router;