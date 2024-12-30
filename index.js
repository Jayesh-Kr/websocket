const express = require('express');
const app = express();

const {WebSocketServer} = require("ws");
const wss = new WebSocketServer({port:8080});
const room = [];
const allRoom = [];
// Websockets stuff....
wss.on('connection',(socket)=>{
    // console.log(`This socket is connected : ${socket}`);
    socket.on("error",()=>{
        console.log("error occured");
    });
    socket.send("User Connected");
    socket.on("message",(data)=>{
        const {roomName,userName,message} = JSON.parse(data);
        // console.log(`RoomName received is : ${roomName}`);
        // console.log(`Username received is : ${userName}`);
        // console.log(`Message received is : ${message}`);

        // for(let a=0; a<room.length; a++) {
            // if(room[a].roomName !== roomName)  
            //     socket.send(`Incorrect Room Name`);
            // console.log("For loop started");
            // console.log(room[a].roomName == roomName)
            const isRoom = allRoom.includes(roomName);
            // if(room[a].roomName == roomName) {
            if(isRoom) {
                const a = allRoom.indexOf(roomName);
                // console.log(a);
                // console.log(!(room[a].users.includes(userName)));
                    if(!(room[a].users.includes(userName)))
                        socket.send("You are not the member of this room. Join the room to chat");

                    else if(!(room[a].userSockets.includes(socket))) {
                        // console.log(!(room[a].userSockets.includes(socket)));
                        room[a].userSockets.push(socket);
                        // console.log("User socket is pushed to the array");
                    }
                    else {
                        // console.log("Condition reached for sending..");
                        for(let x=0; x<room[a].userSockets.length; x++)
                            if(room[a].userSockets[x] != socket){
                                room[a].userSockets[x].send(message);
                                // console.log("Sending msg to users");
                            }
                    }
            }
            else {
                socket.send("Incorrect room entered....");
                socket.close();
            }
        // }
        // socket.send("Room does not exist");
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
    // console.log(room);
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
    // console.log(room);
        res.json(room);
})
app.listen(3000,()=>{
    console.log("Connected to the server");
})