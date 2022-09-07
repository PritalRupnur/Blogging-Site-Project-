const jwt = require('jsonwebtoken');
const AuthorModel = require("../Models/AuthorModel")

const loginAuthor = async function (req, res) {
    try {
        let Email = req.body.email;
        let Password = req.body.password;
        let Author = await AuthorModel.findOne({ email: Email, password: Password });

        if (!Author)
            return res.send({
                status: false,
                msg: "Email or password is not correct",
            });

        let token = jwt.sign(  
            {
                authorId: Author._id.toString(),
                batch: "Plutonium",
                group: 3,
            },
            "Project-1"
        );
        
        res.status(201).send({ status: true, data: token });
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) {
            return res.status(400).send({ status: false, msg: "neccessary header token is missing" })
        }
        
        console.log(token)
         jwt.verify(token, "Project-1", (err, author)=> {
            if(err){ return res.status(403).send("failed authentication")}
            req.authorlogedin = author
        })
        next()
        
    }catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.loginAuthor = loginAuthor;

module.exports.authentication = authentication;

