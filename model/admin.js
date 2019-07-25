var mongoose=require("mongoose")

var PostSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    video:String,
    activeStatus:String
    
})

module.exports=mongoose.model("User",PostSchema)