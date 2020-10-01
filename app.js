const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const Blog = require("./models/blog");

//Connecting MongoDB database
const dbURI =
  "mongodb+srv://jeetintyagi:Q6jAMuonLU98Atqg@cluster0.ja2ir.mongodb.net/node-blog-app?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    //listen for requests
    app.listen(3000);
    console.log(`
    ----------------------------------------------------
    |    Connected to DB                               |
    |    The app is running on: http://localhost:3000/ |
    ----------------------------------------------------
    `);
  })
  .catch((err) => {
    console.log(err);
  });

//register for view engine
app.set("view engine", "ejs");

//middlewares and static files
app.use(express.static("public"));
app.use(morgan("dev"));

//mongoose and mongo sandbox routes
app.get("/create-blog", (req, res) => {
  const blog = new Blog({
    title: "Lorem ipsum dolor sit amet",
    snippet: "about the blog",
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus quidem harum rerum possimus sed nulla, minus eaque veniam earum error dolores eius iure iste repellat! Quasi quia omnis nam corrupti. ",
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/myblogs", (req, res) => {
  Blog.find()
    .then((result) => {
      const list = JSON.stringify(result);
      res.send(list);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/searchblog", (req, res) => {
  Blog.findById("5f759c022efe642a940440eb")
    .then((result) => {
      const list = JSON.stringify(result);
      res.send(list);
    })
    .catch((err) => {
      console.log(err);
    });
});

//!ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.status(200).render("about", { title: "About" });
});

// blogs routes
app.get("/blogs/create", (req, res) => {
  res.status(200).render("create", { title: "Create blog" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "My blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Error page rendering
app.use((req, res) => {
  res.status(404).render("404", { title: "Not found" });
});
