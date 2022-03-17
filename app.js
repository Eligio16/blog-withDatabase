//Require
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

//Parrafos de contenido
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Definiendo app de express
const app = express();

//Render EJS templates
app.set('view engine', 'ejs');

//Metodo para acceder a los elementos HTML desde JS
app.use(bodyParser.urlencoded({extended: true}));

//Acceder a los archivos locales en la carpeta public
app.use(express.static("public"));

//Establecer conexion con BD
main().catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://localhost:27017/blogDB');
}

//Definir esquema
const blogSchema = new mongoose.Schema({
  mTitle: {
    type: String,
    required: [true]
  },
  mPost: String
});

//Compilar esquema en modelo
const Blog = mongoose.model('Blog', blogSchema);

app.get("/", function(req, res){

  Blog.find({}, function(err, posts){
    res.render("home", { startingContent: homeStartingContent, posts: posts});
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog({
    mTitle: req.body.postTitle,
    mPost: req.body.postBody
  });

  post.save((err) =>{
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Blog.findOne({_id: requestedPostId}, (err, post) =>{
    res.render('post', {title: post.mTitle, content: post.mPost});
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
