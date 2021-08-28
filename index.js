require("dotenv/config");
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3333;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

//import routes
const authRoute = require("./Routes/Auth/index");
// const chatRoute = require("./Routes/Chat");

//concern to socket
const http = require("http").createServer(app);
// // server-side
// const io = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

app.get("/", (req, res) => {
  res.send(` We are listening on ${port}`);
});

//connect to db
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@4thyearmidterm.xxc5r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//router for brower
app.use("/api/users", authRoute);

// io.on("connection", (socket) => {
//   socket.on("message", ({ name, message }) => {
//     io.emit("message", { name, message });
//   });
// });

http.listen(port, () => console.log(`Listening to http://localhost:${port}/`));
