var mongoose=require("mongoose")

var PostSchema=new mongoose.Schema({
    title:String,
    description:String,
    file:String,
    userId:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    }
    
})

module.exports=mongoose.model("Post",PostSchema)