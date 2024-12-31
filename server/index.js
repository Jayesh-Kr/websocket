const express = require('express');
const app = express();

const {WebSocketServer} = require("ws");
const wss = new WebSocketServer({port:8080});
const room = [];
const allRoom = [];
wss.on('connection',(socket)=>{
    socket.on("error",()=>{
        console.log("error occured");
    });
    socket.send("User Connected");
    socket.on("message",(data)=>{
        const {roomName,userName,message} = JSON.parse(data);
            const isRoom = allRoom.includes(roomName);
            if(isRoom) {
                const a = allRoom.indexOf(roomName);
                    if(!(room[a].users.includes(userName)))
                        socket.send("You are not the member of this room. Join the room to chat");

                    else if(!(room[a].userSockets.includes(socket))) {
                        room[a].userSockets.push(socket);
                    }
                    else {
                        for(let x=0; x<room[a].userSockets.length; x++)
                            if(room[a].userSockets[x] != socket){
                                room[a].userSockets[x].send(message);
                            }
                    }
            }
            else {
                socket.send("Incorrect room entered....");
                socket.close();
            }
    })
})

// Express stuff...
app.use(express.json());

app.get('/',(req,res)=>{
    console.log("Endpoint called");
    res.send("Hey");
});

app.post("/joinRoom",(req,res)=>{
    const {roomName,userName} = req.body;
    for(let a=0; a<room.length;a++){
        if(room[a].roomName === roomName)
            room[a].users.push(userName);
    }
    res.send("User added to room successfully");
});

app.post('/addroom',(req,res)=>{
    const {roomName , users} = req.body;
    room.push(
        {
            roomName : roomName,
            users : users,
            userSockets : []
        }
    );
    allRoom.push(roomName);
    res.send("User and room created Successfully..");
});

app.get("/getroom",(req,res)=>{
        res.json(room);
})
app.listen(3000,()=>{
    console.log("Connected to the server");
})