var express=require('express');
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride = require('method-override');
var expressSanitizer = require("express-sanitizer");
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
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
app.get('/blogs/:id',(req,res)=>{
   Blog.findById(req.params.id,(err,foundObj)=>{
       if(err)
       console.log("Error!");
       else{
           res.render('show',{blog:foundObj});
       }
   });
});
app.post('/blogs',(req,res)=>{
    req.body.newBlog.body=req.sanitize(req.body.newBlog.body);
    Blog.create(req.body.newBlog,(err,newBlogObj)=>{
        if(err)
        console.log('error');
        else
        res.redirect('/blogs');
    });
    });
app.get('/blogs/:id/edit',(req,res)=>{
   Blog.findById(req.params.id,(err,foundObj)=>{
       if(err)
       {
           app.redirect('/blogs');
       }
       else{
           res.render('edit',{currentBlog:foundObj}); 
       }
   });
    
   
});
app.put('/blogs/:id',(req,res)=>{
    req.body.updatedBlog.body=req.sanitize(req.body.updatedBlog.body);
  Blog.findOneAndUpdate({_id: req.params.id},req.body.updatedBlog,(err,updatedObj)=>{
      if(err){
          console.log("update error!!!!!");
          res.redirect('/blogs/'+req.params.id);
      }
      else{
          res.redirect('/blogs/'+req.params.id);
      }
  });
});
app.delete('/blogs/:id',(req,res)=>{
  Blog.findOneAndDelete({ _id: req.params.id},(err,updatedObj)=>{
      if(err){
          res.redirect('/blogs/');
      }
      else{
          res.redirect('/blogs/');
      }
  });
});
app.listen(process.env.PORT,process.env.IP,()=>{
   console.log("Server started!"); 
});