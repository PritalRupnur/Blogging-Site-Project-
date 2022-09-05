const BlogModel = require("../Models/BlogModel")
const ObjectId = mongoose.Types.ObjectId;

const validAuthorid =  async function (req, res) {
    let blog = req.body
    let auth_ID = blog.authorId


   let validAuth= ObjectId.isValid(auth_ID)
   
if (validAuth === false) {
    return res.send("invalid lenght of author")
}
next() }