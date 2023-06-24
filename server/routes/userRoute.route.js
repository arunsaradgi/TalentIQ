const express=require("express")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/usermodel.model");
const { BlacklistModel } = require("../models/black.model");
const userRoute=express.Router()

userRoute.get("/",async(req,res)=>{
    try {
        const user=await UserModel.find()
        res.status(200).json({msg:"home",user})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

userRoute.post("/register",async(req,res)=>{
    const {email,passward}=req.body
    try {
        const data=await UserModel.findOne({email})
        if(data){
            res.status(200).json({msg:"user already login",data})
        }
        else{
            bcrypt.hash(passward, 5, async(err, hash)=>{
                if(hash){
                    const user=new UserModel({email,passward:hash})
                    await user.save()
                    res.status(200).json({msg:"add",user})
                }
                else{
                    res.status(400).json({msg:"not hashed"})
                }
            });
        }
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

userRoute.post("/login",async(req,res)=>{
    try {
        const {email,passward}=req.body
        const person=await UserModel.findOne({email})
        if(person){
            bcrypt.compare(passward, person.passward,(err, result)=> {
                if(result){
                    var token = jwt.sign({userID:person._id,user:person.name},process.env.secret,{expiresIn:"1d"});
                    res.status(200).json({msg:"Login succssfully",token})
                }
                else{
                    res.status(200).json({error:"wrong credentials"})
                }
            });
        }
        else{
            res.status(200).json({error:"user not found. please register first!!"})
        }
    } catch (error) {
        res.status(200).json({error:error.message})
    }
})

userRoute.get("/logout" , async (req,res)=>{ 
    const token = req.headers.authorization?.split(" ")[1] 
    try { 
        const blacklistToken = new BlacklistModel({ 
            token 
        }) 
        await blacklistToken.save(); 
        res.status(200).json({msg:"User has been logged out"}) 
    } catch (error) { 
        res.status(200).json({error:error.message})
    }
})

module.exports={
    userRoute
}