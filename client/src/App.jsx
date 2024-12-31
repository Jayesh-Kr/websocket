import { useEffect, useRef, useState } from "react"

const App = () => {
  const msg = useRef("");
  const [ws , setWs] = useState(null);
  const [roomName , setRoomName] = useState("");
  const [userName , setUserName] = useState("");
  const [text , setText] = useState([]);
  useEffect(()=>{
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () =>{
      console.log("Connection is established");
      const uName = prompt("Username de apna");
      setUserName(uName);
      const rName = prompt("Room name bata");
      setRoomName(rName);
      const initialMessage = JSON.stringify({
        userName: uName,
        roomName: rName,
        message: "This message is for connection"
      });
      socket.send(initialMessage);
    }
    setWs(socket);
    return () => {
      socket.close();
    }
  },[])
  if(ws) {
    ws.onclose = () => {
    console.log("Websocket connection closed");
  }
    ws.onmessage = (data) => {
      setText(prevText => [...prevText, data.data]);
    }
}
  const sendMsg = () =>{
    const obj = {
      userName : userName,
      roomName : roomName,
      message : msg.current.value
    }
    ws.send(JSON.stringify(obj));
    setText(prevText => [...prevText,msg.current.value]);
  }
  return (
    <>
    <div className="messages">
      {
        text.map((data,index)=> (
          <div key={index}>{data}</div>
        ))
      }
    </div>
    <div className="text_area">
      <input type="text" ref={msg} />
      <button onClick={sendMsg}>Send</button>
    </div>
    </>
  )
}

export default App