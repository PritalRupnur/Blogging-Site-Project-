const AuthorModel = require("../Models/AuthorModel")
const jwt = require('jsonwebtoken')


//*********************************************** [createAuthors] ******************************************************************** */
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const isValidRequest = function (object) {
  return Object.keys(object).length > 0;
};

// using regex for validate email, password, & keys.
const isValidEmail = function (value) {
  const regexForEmail = /^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/;
  return regexForEmail.test(value);
};

const isValidPass = function (value) {
  const regexForPass =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{6,20}$/; 
  return regexForPass.test(value);
};
const regixValidator = function (value) {
  const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regex.test(value);
};

//*************************************************************** [REGISTER NEW AUTHOR] ********************************************************************************************* */

const createAuthors = async function (req, res) {
  try {
    let requestBody = req.body;

    if (!isValidRequest(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "author data is required" });
    }
    //using desturcturing
    const { fname, lname, title, email, password } = requestBody;

    //requestBody should not have more than 5keys as per outhorSchema
    if (Object.keys(requestBody).length > 5) {
      return res.status(400).send({
        status: false,
        message: "invalid data entry inside request body",
      });
    }

    if (!isValid(fname) || !regixValidator(fname)) {
      return res.status(400).send({
        status: false,
        message: "first name is required or its should contain character",
      });
    }

    if (!isValid(lname) || !regixValidator(lname)) {
      return res.status(400).send({
        status: false,
        message: "last name is required or its should contain character",
      });
    }

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }

    if (!["Mr", "Mrs", "Miss"].includes(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title should contain Mr.,Mrs.,Miss" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email address" });
    }

    const isEmailUnique = await AuthorModel.findOne({ email: email });

    if (isEmailUnique) {
      return res
        .status(400)
        .send({ status: false, message: "Email already exits" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!isValidPass(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid password" });
    }

    const authorData = {
      fname: fname.trim(),
      lname: lname.trim(),
      title: title.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    const newAuthor = await AuthorModel.create(authorData);
    res.status(201).send({
      status: true,
      message: "author registered successfully",
      data: newAuthor,
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};
//********************************************************************************* [loginAuthors] ******************************************************************** */

const loginAuthors = async function (req, res) {
  try {
    let Email = req.body.email;
    let Password = req.body.password;
    let Author = await AuthorModel.findOne({
      email: Email,
      password: Password,
    });

    if (!Email) {
      return res
        .status(400)
        .send({ status: false, message: 'Email is mandatory' });
    }

    if (!Password) {
      return res
        .status(400)
        .send({ status: false, message: 'Password is mandatory' });
    }

    if (!/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/.test(Email)) {
      return res
        .status(400)
        .send({ status: false, message: 'Email format is invalid' });
    }
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{6,20}$/.test(
        Password
      )
    ) {
      return res
        .status(400)
        .send({
          msg: 'Password should be min 6 & max 20 character.It containt atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character',
        });
    }

    if (!Author)
      return res.send({
        status: false,
        msg: 'Email or password is not correct',
      });

    let token = jwt.sign(
      {
        authorId: Author._id.toString(),
        batch: 'Plutonium',
        project: 'blogging-site',
        group: 3,
      },
      'Project-1'
    );

    res.status(201).send({ status: true, data: token });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports = { createAuthors, loginAuthors };
