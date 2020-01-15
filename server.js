let express = require("express");
let app = express();
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
reloadMagic(app);
app.use("/", express.static("build"));
app.use("/uploads", express.static("uploads"));
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-moshr.azure.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("media-board");
});
app.get("/all-posts", (req, res) => {
  console.log("request to /all-posts");
  dbo
    .collection("posts")
    .find({})
    .toArray((err, ps) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      console.log("posts", ps);
      res.send(JSON.stringify(ps));
    });
});
app.post("/login", upload.none(), (req, res) => {
  console.log("login", req.body);
  let name = req.body.username;
  let pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      console.log("user not found");
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password === pwd) {
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});
app.post("/new-post", upload.single("img"), (req, res) => {
  console.log("request to /new-post. body: ", req.body);
  let description = req.body.description;
  let username = req.body.username;
  let file = req.file;
  let frontendPath = "/uploads/" + file.filename;
  dbo.collection("posts").insertOne({
    description: description,
    frontendPath: frontendPath,
    username: username
  });
  res.send(JSON.stringify({ success: true }));
});
////////ici
app.post("/new-user", upload.none(), (req, res) => {
  console.log("request to /new-user. body: ", req.body);
  let username = req.body.username;
  let password = req.body.password;
  let file = req.file;
  let frontendPath = "/uploads/" + file.filename;
  dbo.collection("users").insertOne({
    username: username,
    password: password
  });
  res.send(JSON.stringify({ success: true }));
});

app.post("/update", upload.none(), (req, res) => {
  console.log("request to /update");
  let id = req.body.id.toString();
  let desc = req.body.description;
  console.log("sent from client", desc, id);
  dbo.collection("posts").updateOne({ _id: ObjectID(id) }, { $set: { description: desc } });
  res.send("success");
});
app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
