var express = require("express");
app = express();
bodyParser = require("body-parser");
bcrypt=require('bcrypt-nodejs');
cors=require('cors');
mongoose = require("mongoose");
User = require('./model/user');
Post =require('./model/post');
multer=require('multer');
multerS3=require('multer-s3');
aws=require('aws-sdk');
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
     // some legacy browsers (IE11, various SmartTVs) choke on 204 
    }
    
app.use(cors(corsOptions));
// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });
var k;

mongoose.connect("mongodb://localhost:27017/publicshare_app" ,{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





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

aws.config.update({
    secretAccessKey: 'ZkGH0h2hCM27hH/zJ7ghGjSSqVjjtOOWjbt3v5he',
    accessKeyId: 'AKIAILQS6MVEVPBOXDQA',
    region: 'us-east-2',
    ACL:'public-read'
});


s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'upload-project-images',
        key: function (req, file, cb) {
            cb(null,file.originalname);
        }
        
    })
    
});

app.post('/api/upload',upload.array('file'), function (req, res, next) {
    var title=req.body.title;
    var description=req.body.description;
    
    var fileURL= 'https://s3.console.aws.amazon.com/s3/buckets/upload-project-images/'+req.body.file;
console.log(upload.array('file'));
    console.log(title,description,fileURL)

    var postData={
        title:title,
        description:description,
        file:fileURL
    }

    Post.create(postData,function(err,post){
        if(err){
            console.log(err)
        }if(!post){
            console.log('no posts available')
        }else{
            console.log(post)
        }
    })
    res.send("Uploaded!");
});

app.get('/postcreate',(req,res)=>{
  res.send({
      message: "Hello"
  })
});

app.listen(8880, function () {
    console.log("server has started");
})