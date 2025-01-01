const express = require('express');
const {creatserver} = require("node:http");
const {join} = require("node:path");
const {Server} = require("socket.io")
const app = express();
const server = creatserver(app);
const io = new Server(server);

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,"index.html"));
});

io.on("connection",(socket)=>{
    console.log("A user is connected");
})

app.listen(3000,()=>{
    console.log("Server started at port 3000");
})