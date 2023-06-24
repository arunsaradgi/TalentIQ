const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{type:String},
    passward:{type:String}
},{
    versionKey:false
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}