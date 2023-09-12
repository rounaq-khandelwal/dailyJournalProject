const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => console.log("connection successful..."))
  .catch((err) => console.log(err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);
const homeStartingContent = "Welcome to Daily Journal, where your life's moments find their eternal home. Our platform is a sanctuary for self-expression and introspection. With each entry, you embark on a personal journey, capturing your thoughts, emotions, and experiences, one page at a time. Customize your journal to reflect your unique style and unleash your creativity through words, images, and multimedia. We prioritize your privacy, ensuring your reflections remain your own. Join our vibrant community of journal enthusiasts, sharing your stories, gaining inspiration, and connecting with kindred spirits. Start today, and let Daily Journal become your digital haven for documenting the beauty of life's tapestry."
const aboutContent = "Hello, I'm Rounaq Khandelwal, a passionate tech enthusiast currently pursuing my 4th year of B.Tech at Netaji Subhas University of Technology. My journey in the world of technology has been nothing short of exhilarating. I'm driven by an insatiable curiosity for all things tech-related, constantly seeking to understand and harness the latest innovations. From coding and software development to exploring cutting-edge gadgets and staying updated with the tech industry's trends, I thrive on the excitement of this ever-evolving field. I believe that technology has the power to transform our world, and I'm dedicated to being a part of that transformation. Join me on my tech journey as we explore the limitless possibilities of the digital realm together!";
const contactContent = "Feel free to reach out if you have any questions, suggestions, or just want to connect. I'm always eager to engage in tech discussions and connect with fellow enthusiasts. You can contact me via mail: rounaq.ug20@nsut.ac.in"

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
    // console.log(articles);
  } catch (err) {
    console.log(err);
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const createDocument = async () => {
    try {
      const postDetails = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
      const result = await postDetails.save();
      console.log(result);
    }
    catch (err) {
      console.log(err);
    }
  }
  createDocument();
  res.redirect("/");

});

app.get("/posts/:postId", function (req, res) {
  // const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
  const getDocument = async () => {
    try {
      const post = await Post.findOne({ _id: requestedPostId });
      // console.log(post);
      // console.log(post.title);
      // console.log(post.content);
      res.render("post.ejs", {
        title: post.title,
        content: post.content
      });
    }
    catch (err) {
      console.log(err);
    }
  }
  getDocument();
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
