const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const socketIo = require("socket.io");
const config = require("./config");

const hostname = "localhost";
const port = 5000;
let router = require('./router');
var app = express();

mongoose
.connect(config.db)
.then(() => console.log("Connection successful!"))
.catch((err) => console.error(err));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // allow all origins
    },
});

io.on("connection", (socket) => {
    console.log("Socket, new connection", socket.id);

    socket.on("disconnect", () => {
        console.log("❶ : A user disconnected");
        socket.disconnect();
    });
});

app.use(router.init(io));
app.use("/images", express.static(path.join(__dirname, "images")));

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});