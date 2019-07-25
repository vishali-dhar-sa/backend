var mongoose=require("mongoose")

var PostSchema=new mongoose.Schema({
    title:String,
    description:String,
    file:String,
})

module.exports=mongoose.model("Post",PostSchema)