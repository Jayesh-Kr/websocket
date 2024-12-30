const express = require('express');
const app = express();

const {WebSocketServer} = require("ws");
const wss = new WebSocketServer({port:8080});
const room = []
// Websockets stuff....


// Express stuff...
app.use(express.json());

app.get('/',(req,res)=>{
    console.log("Endpoint called");
    res.send("Hey");
});

app.post('/addroom',(req,res)=>{
    const {roomName , users} = req.body;
    console.log()
    room.push(
        {
            roomName : roomName,
            users : users
        }
    );
    res.send("User and room created Successfully..");
});

app.get("/getroom",(req,res)=>{
    console.log(room);
        res.json(room);
})
app.listen(3000,()=>{
    console.log("Connected to the server");
})