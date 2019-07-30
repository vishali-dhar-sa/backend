var express    = require("express");
    app        = express();
    bodyParser = require("body-parser");
    bcrypt     = require('bcrypt-nodejs');
    cors       = require('cors');
    mongoose   = require("mongoose");
    User       = require('./model/user');
    Post       = require('./model/post');
    multer     = require('multer');
    multerS3   = require('multer-s3');
    aws        = require('aws-sdk');
    jwt        = require('jsonwebtoken');
    env        = require('dotenv');

var corsOptions = {
    origin: 'http://localhost:4000',
    optionsSuccessStatus: 200,
     // some legacy browsers (IE11, various SmartTVs) choke on 204 
    }
    
app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost:"+ process.env.DB_PORT + "/publicshare_app" ,{ useNewUrlParser: true });

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

    User.create(Userdata, function(err, registeredUser){
        if (err) {
            console.log(err)
        } else {
            let payload={subject:registeredUser._id}
            let token=jwt.sign(payload,"secretkey")
            res.json({token:token})
        }

    })
})    

app.post('/api/login',(req, res) => {
    var email1 = req.body.email;
    var password1 = req.body.password;
    var value=false;

    User.findOne({email : email1}).exec(function(err,user){
        if(err){
            console.log(err);
        }if(!user){
            console.log("Log in fail")
        }
        else{
              value= bcrypt.compareSync(password1, user.password)
              if(value){
                  console.log("matched");
                  let payload={subject:user._id}
                  let token =jwt.sign(payload,'secretkey')
                  res.json({token:token});
                  return;
                }
             }   // console.log("log in successfull!")
        });
        // if(!value){
        // console.log("Sorry! password is wrong")
    // }
})

aws.config.update({ 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env. AWS_SECRET_ACCESS_Id,
    region: process.env.AWS_REGION,
    ACL:'public-read'
});


s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'upload-project-images',
        key: function (req, file, cb) {
           
            cb(null, new Date().getTime() + "-" + file.originalname);
            console.log(file)
        }
        
    })
    
});


app.post('/api/upload',upload.array('file'), function (req, res, next) {
    var title=req.body.title;
    var description=req.body.description;
    var fileURL=req.files[0].key;

    console.log(upload.array('file'));
    console.log(title,description,fileURL)

    var postData={
        title:title,
        description:description,
        file:fileURL
    }

    Post.create(postData, function(err,post){
        if(err){
            console.log(err)
            res.status(400).send(err)

        }if(!post){
            console.log('no posts available')

        }else{
            console.log(post)
        }
    })
    res.send("Uploaded!");
});

app.get("/home",function(req,res){
    Post.find({}, function(err,allPosts){
        if(err){
            console.log(err);
        }else{
            console.log(allPosts);
            res.json({allPosts})
        } 
    })      
    
})

app.get("/home/:id",function(req,res){
    Post.findById(req.params.id ,function(err,post){
        if(err){
            console.log(err)
        }else{
            console.log(post)
            //res.send("post found")
        }
    })

    
})


app.listen(process.env.PORT, function () {
    console.log("server has started");
})