var express = require("express");
app = express();
bodyParser = require("body-parser");
bcrypt=require('bcrypt-nodejs');
cors=require('cors');
mongoose = require("mongoose");
User = require('./model/user');
Post =require('./model/post');
upload=require('./service/upload');


mongoose.connect("mongodb://localhost/publicshare_app");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
    }
    
    app.use(cors(corsOptions))


app.post('/api/signup',(req, res) => {
    console.log(req.body);
    var email1 = req.body.email;
    var hash=bcrypt.hashSync(req.body.password);
    // var password1 = req.body.password;

    var Userdata = {
        email:email1,
        password:hash
    }

    User.create(Userdata, function(err, res){
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }

    })
})    

app.post('/api/login',(req, res) => {
    var email1 = req.body.email;
   
    var password1 = req.body.password;

    // var Userdata = {
    //     email:email1,
    //     password:password1
    // }
    var value=false;
    User.findOne({email : email1}).exec(function(err,data){
        if(err){
            console.log(err);
        }if(!data){
            console.log("Log in fail")
        }
        else{
              value= bcrypt.compareSync(password1, data.password)
              if(value){
                  console.log("matched");
                  res.json(data);
                  return;
                }
             }   // console.log("log in successfull!")
        });
        // if(!value){
        // console.log("Sorry! password is wrong")
    // }
})  

// var singleUpload=upload.single('image');
// app.post('/image-upload',function(req,res){
//     singleUpload(req,res,function(err){
//         return res.json({'imageUrl':req.file.location})
//     })
// })

// app.post('/api/postcreate',function(res,res){
//     var title=req.body.title;
//     var description=req.body.description;

//     var postData={
//         title:title,
//         description:description
//     }
//     Post.create(postData,function(err,post){
//         if(err){
//             console.log(err)
//         }else{
//             console.log(post)
//         }
    
//     })    

// })
   




app.listen(8880, function () {
    console.log("server has started");
})