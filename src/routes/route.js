const express = require('express');
const router = express.Router();

const authorController= require("../Controllers/AuthorController")




router.post("/createAuthor", authorController.createAuthor  )


//router.get("/updatedHC", bookController.updatedHC)
module.exports = router;