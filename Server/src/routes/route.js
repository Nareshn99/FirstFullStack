const express=require('express');
const router=express.Router()
const {createUser,login,getUser}=require('../controllers/userController')
const {authentication, authorization}=require('../middelwares/authrentication')


//Users Api's
router.post('/register',createUser)
router.post('/login',login)
router.get('/user',getUser)


//errorHandling for wrong address
router.all("/**",(_, res) =>{
    res.status(400).send({status: false,message: "The api you request is not available"})
})

module.exports=router