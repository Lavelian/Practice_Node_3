const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

require("dotenv").config();

const Message = require("./model/message");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const { DB_HOST, PORT = 3001 } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("server start");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const server = app.listen(PORT);

const io = socket(server, {
  cors: { origin: "http://localhost:3000", credential: true },
});

global.onlineUsers = new Map();

io.on("connection", async (socket) => {
  const allMessages = await Message.find();

  socket.emit("allMassages", allMessages);

  socket.broadcast.emit("onlineUsers", onlineUsers.size);
  socket.on("addUser", (user) => {
    onlineUsers.set(user.id, socket.id);
    socket.broadcast.emit("newUserName", user.name);
  });

  socket.on("sendMessage", async (data) => {
    const message = await Message.create(data);
    socket.broadcast.emit("newMessage", message);
  });

  socket.on("disconnect", (id) => {
    onlineUsers.delate(id);
    socket.broadcast.emit("onlineUsers", onlineUsers.size);
  });
});
