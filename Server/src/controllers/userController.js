const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { isValidBody, isEmpty, isValidEmail, isValidPhone, isValidPassword, isValidPincode, isValidName } = require('../utils/validation')


const createUser = async (req, res) => {
    try {
        let { FullName, email, phone, password } = req.body
        //validation for emptyBody
        if (!isValidBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }
        if (!FullName) {
            return res.status(400).send({ status: false, message: "fname Is Mandatory " });
        }
        if (!isValidName(FullName)) {
            return res.status(400).send({ status: false, message: "fname should be alphabatical Order And String only" });
        }

        //validation for email
        if (!email) {
            return res.status(400).send({ status: false, message: "email Is Mandatory " });
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid Email" });
        }
        //validation for phone 
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone Is Mandatory" });
        }
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        }
        // Check for the uniqueness of email and phone
        let user = await userModel.find({ $or: [{ email }, { phone }] })
        for (let key of user) {
            if (key.email == email.trim().toLowerCase()) {
                return res.status(409).send({ status: false, message: "Given email is already taken" })
            }
            if (key.phone == phone) {
                return res.status(409).send({ status: false, message: "Given phone is already taken" })
            }
        }
        //validation for password
        if (!password) {
            return res.status(400).send({ status: false, message: "password Is Mandatory" });
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Weak Password,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }
        //bcrypt password
        const hashedPassword = await bcrypt.hash(password, 10)
        let dataCreted = { FullName, email, phone }
        dataCreted.password = hashedPassword
        let data = await userModel.create(dataCreted)
        return res.status(201).send({ status: true, message: "User created successfully", data: data });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



const login = async (req, res) => {
    try {
        let data = req.body;
        let { email, password } = data

        //validation for emptyBody
        if (!isValidBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }
        //validation for email
        if (!email) {
            return res.status(400).send({ status: false, message: "email Is Mandatory " });
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid Email" });
        }
        //validation for password
        if (!password) {
            return res.status(400).send({ status: false, message: "password Is Mandatory" });
        }
        //find user from dataBase
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" });
        }
        let correctPass = await bcrypt.compare(password, user.password)
        if (!correctPass) {
            return res.status(400).send({ status: false, message: "Invalid Password" });
        }
        let userId = user._id;
        const token = jwt.sign({ userId: userId }, "narshdnfjdfnfvnfn", { expiresIn: "1d" });
        res.status(200).send({ status: true, message: "User logged in successfully", data: { userId: userId, token } });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};



const getUser = async (req, res) => {
    try {
        //let userId = req.params.userId
        let findUser = await userModel.find().select({_id:0,FullName:1,email:1,phone:1})
        return res.status(200).send(findUser )
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = {
    createUser,
    login,
    getUser
}