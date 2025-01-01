const express = require('express');
const {createServer} = require("node:http");
const {join} = require("node:path");
const {Server} = require("socket.io")
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,"index.html"));
});

io.on("connection",(socket)=>{
    console.log("A user is connected");
    socket.on('disconnect',()=>{
        console.log("User disconnected");
    });

    // chat msg socket
    socket.on('chat message',(data)=>{
        console.log(`Received Msg : ${data}`);
        io.emit('chat message',data);
    })
});

server.listen(3000,()=>{
    console.log("Server started at port 3000");
})
