const { render } = require("ejs");
const express = require("express");
const app = express();
const blogRoutes = require("./routes/blogRoutes");

const mongoose = require("mongoose");
const morgan = require("morgan");

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

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});