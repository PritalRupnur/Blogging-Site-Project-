const jwt = require('jsonwebtoken');
const AuthorModel = require("../Models/AuthorModel")

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) {
            return res.status(400).send({ status: false, msg: "neccessary header token is missing" })
        }
        
         jwt.verify(token, "Project-1", (err, author)=> {
            if(err){ return res.status(403).send("failed authentication")}
            req.authorLoggedIn = author
        })
        next()
         
    }catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.authentication = authentication