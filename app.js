var express=require('express');
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/blogdb",{ useNewUrlParser: true });

var schema=new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",schema);

// Blog.create({
//     title:"Hii this is a title",
//     image:"https://www.allthetests.com/quiz33/picture/pic_1483534414_1001.jpg",
//     body:"Super saiyan god"
// },(err,addedObj)=>{
//     if(err)
//     console.log("Error");
//     else
//     console.log("Added successfully!",addedObj);
// });
app.get('/',(req,res)=>{
    res.redirect('/blogs');
})
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,Blogs)=>{
        if(err)
        console.log("Error!");
        else
        res.render("index",{Blogs:Blogs});
    });
    
});
app.get('/blogs/new',(req,res)=>{
   res.render('new'); 
});
app.post('/blogs',(req,res)=>{
    Blog.create(req.body.newBlog,(err,newBlogObj)=>{
        if(err)
        console.log('error');
        else
        res.redirect('/blogs');
    });
    });
app.listen(process.env.PORT,process.env.IP,()=>{
   console.log("Server started!"); 
});