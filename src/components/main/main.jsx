import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { create } from "zustand";
import QueuedMessageUsers from "../chat/queuedChat/queuedChat";
import ChatMessage from "../chat/chatWindow/chatWindow";
import useWebSocket from "react-use-websocket";
export const useChatAppStore = create((set) => ({
  chatTokenDetails: [],
  userDetails: [],
  roomSubScribeId: "",
  setUserDetails: (details) => set((state) => ({userDetails: details})),
  setRoomSubScribeId: (id) => set((state) => ({roomSubScribeId: id})),
  setChatTokenDetails: (chatDetails) =>
    set((state) => ({ chatTokenDetails: chatDetails })),
}));

function Main() {
  const getUserDetail = useChatAppStore(state => state.userDetails);  
  const alertRef = useRef();
  const [newMessage, setNewMessage] = useState("");
  //Enter your domain name here instead of example.com
  const socket = useWebSocket(`wss://${getUserDetail.authToken}@example.com/websocket`);
  const getChatTokenDetails = useChatAppStore(state => state.chatTokenDetails);
  const setChatTokenDetails = useChatAppStore(state => state.setChatTokenDetails);
  const getRoomSubScribeId = useChatAppStore(state => state.roomSubScribeId);
  const setRoomSubScribeId = useChatAppStore(state => state.setRoomSubScribeId);
  

  const triggerOtherCalls = () => {
   
  let getRooms = {
    "msg": "method",
    "method": "rooms/get",
    "id": String(messagesCount++),
    "params": []
}

  let streamNotifyObj = {
    msg: 'method',
    method: 'stream-notify-room',
    params: [
      'null/typing',
      guestName, true, {
        token: String(chatToken)
      }
    ],
    id: String(messagesCount++)
  };

  let streamLivechatRoom = {
    msg:'sub',
    id:String(streamLivechatchatRoomId),
    name:'stream-livechat-room',
    params:[
    String(chatRoomId),
    {
      useCollection:false,
      args:[{'visitorToken':String(chatToken)}]
    }]
  }

  let subObj = {
    msg: 'sub',
    id: subId,
    name: 'meteor.loginServiceConfiguration',
    params: []
  }

  let UserPresence2 = {
    msg:'method',
    method:'UserPresence:online',
    params:[String(chatToken)],
    id:String(messagesCount++),
  }
  
let getInitialDataObject = {
  msg: 'method', 
  method: 'livechat:getInitialData', 
  params: [String(chatToken), null],
  id: String(messagesCount++),
}

let loginByToken = {
  "msg": "method",
  "method": "login",
  "id": String(messagesCount++),
  "params":[
      { "resume": location.state.authToken }
  ]
}

let streamNotifyUser2 = {
  msg: "sub",
  id: String(generateHash(17)),
  name: "stream-notify-user",
  params: [
    `${location.state.userId}/subscriptions-changed`,
    {
      useCollection: false,
      args: [],
    },
  ],
};


  setTimeout(() => {
    socket.sendMessage(JSON.stringify(subObj));
  }, 4000)


    socket.sendMessage(JSON.stringify(loginByToken));
    socket.sendMessage(JSON.stringify(streamNotifyUser2));
    socket.sendMessage(JSON.stringify(streamLivechatRoom));
    socket.sendMessage(JSON.stringify(getInitialDataObject));
    socket.sendMessage(JSON.stringify(getRooms));
    socket.sendMessage(JSON.stringify(streamNotifyObj));

  setTimeout(()=>{
    socket.sendMessage(JSON.stringify(UserPresence2));
},14000)

  }

  useEffect(() => {
    if(socket.lastMessage)
    { if(JSON.parse(socket.lastMessage.data).msg == 'connected')
      {
        triggerOtherCalls();
      }
      if(JSON.parse(socket.lastMessage.data).msg == 'changed')
      {
        let collection = JSON.parse(socket.lastMessage.data).collection;
        switch(collection)
        {
          case 'stream-room-messages':
            let initalDataArray = JSON.parse(socket.lastMessage.data).fields.args;
            let type = initalDataArray[0].t;
            message && setMessage((prev) => prev.concat(initalDataArray));
            console.log(type);
            if(alertRef)
            {
              audio.play();
              alertRef.current.className = 'blink_me';
    
              setTimeout(()=>{
                alertRef.current.className = '';
              },2000)
            }
            break;
          case 'stream-notify-user':
            let responseJSON = JSON.parse(socket.lastMessage.data).fields.args;
            if(responseJSON[0] == "inserted")
            {
              if(alertRef)
              {
                audio.play();
                alertRef.current.className = 'blink_me';
                alertRef.current.textContent = 'New Vistor joined';
                setTimeout(()=>{
                  alertRef.current.className = '';
                  alertRef.current.textContent = 'Alert';
                },2000)
              }
              setData((prev) => prev.concat(responseJSON[1]));
              console.log(responseJSON[1]);
            }
            if(responseJSON[0] == "update")
            {
              console.log(responseJSON[1]);
            }

            if(responseJSON[0] == "removed")
            {
              console.log(data);
              setData((prev) => prev.filter((val, index)=>{return val._id !== responseJSON[1]._id}));
              console.log(responseJSON[1]);
            }
            break;  
        }
      }
      if(JSON.parse(socket.lastMessage.data).msg == 'ping')
      {
        socket.sendMessage(JSON.stringify({msg: 'pong'}));
      }
    }
  }, [socket.lastMessage]);
  

  function generateHash(targetLength) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < targetLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  let messagesCount = 1;
  let chatToken = generateHash(17);
  let chatRoomId = generateHash(17);
  let subId = generateHash(17);
  let roomSubId = generateHash(17);
  let streamLivechatchatRoomId = generateHash(17);
  let guestName = 'guest';

useEffect(()=>{
    
  if(socket.readyState == 1)
  {
    getCurrentRoomInfo(location.state.userId, location.state.authToken);
    let initialConnect = {
            "msg": "connect",
            "version": "1",
            "support": ["1", "pre2", "pre1"]
    }
      socket.sendMessage(JSON.stringify(initialConnect))
  }
},[socket.readyState])

  const location = useLocation();
  const navigate = useNavigate();
  //Change base url here : 
  const baseURL = "https://example/api/v1";

  const [data, setData] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [message, setMessage] = useState();
  const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");

  var queuedMessage = [];
  const logoutUser = () => {
    axios({
      method: "POST",
      url: `${baseURL}/logout`,
      headers: {
        "X-Auth-Token": location.state.authToken,
        "X-User-Id": location.state.userId,
      },
    })
      .then((response) => {
        window.alert(response.data.data.message);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
    
  const getCurrentRoomInfo = (userid, authToken) => {
    axios({
      method: "GET",
      url: `${baseURL}/rooms.get`,
      headers: {
        "X-Auth-Token": authToken,
        "X-User-Id": userid,
      },
    })
      .then((response) => {
        response.data.update.map((val, index) => {
          if (val.t == "l") {
            queuedMessage.push(val);
          }
        });
        setData(queuedMessage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadMessageHistory = (e, val, token) => {
    setMessage();
    let rid = (val?.rid) ? val?.rid : val?._id;
    rid && token && setChatTokenDetails([rid, token]);
    console.log(val);
    let unsubscribe = {
      "msg": "unsub" ,
      "id": getRoomSubScribeId,
    }

    getRoomSubScribeId !== "" && socket.sendMessage(JSON.stringify(unsubscribe));

    let createNewSubId = String(roomSubId);
    

    let roomMessagesSub = {
      msg: "sub",
      id: createNewSubId,
      name: "stream-room-messages",
      params: [
        rid,
        {
          useCollection: false,
          args: [{ visitorToken: val.v.token }],
        },
      ],
    };

    let roomLivechatQueueMessagesSub = {
      msg: "sub",
      id: String(streamLivechatchatRoomId),
      name: "stream-livechat-inquiry-queue-observer",
      params: [
        "public",
        {
          useCollection: false,
          args: [],
        },
      ],
    };

    let streamNotifyUser1 = {
      msg: "sub",
      id: String(generateHash(17)),
      name: "stream-notify-user",
      params: [
        `${rid}/webrtc`,
        {
          useCollection: false,
          args: [],
        },
      ],
    };
	   
    socket.sendMessage(JSON.stringify(roomMessagesSub));
    socket.sendMessage(JSON.stringify(roomLivechatQueueMessagesSub));
    socket.sendMessage(JSON.stringify(streamNotifyUser1));
    
    setRoomSubScribeId(createNewSubId);

    axios({
      method: "GET",
      url: `${baseURL}/livechat/messages.history/${rid}?token=${token}`,
    })
      .then((response) => {
        setUserDetails({
          token: token,
          rid: rid,
        });
        let arrayOfMessage = response.data.messages;
        arrayOfMessage.reverse();
        JSON.stringify(data) !== JSON.stringify(arrayOfMessage) &&
          setMessage(arrayOfMessage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
};

const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageToLiveChat(newMessage);
    setNewMessage("");
};

  const sendMessageToLiveChat = async (message) => {
    const payloadDetails = userDetails;
    let body = {
      message: {
        rid: payloadDetails?.rid,
        msg: message,
      },
    };
    axios({
      method: "POST",
      url: `${baseURL}/chat.sendMessage`,
      data: body,
      headers: {
        "X-Auth-Token": location.state.authToken,
        "X-User-Id": location.state.userId,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

const callAddMessage = (e) => {
  if(e.keyCode == 13)
  {
    sendMessageToLiveChat(e.target.value);
    setNewMessage("");
  }
}

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "rowReverse",
          gap: "9px",
          margin: "16px",
          justifyContent: "space-between"
        }}
      >
        <button
          style={{
            padding: "5px 31px",
            borderRadius: "2px",
            background: "red",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => {
            logoutUser();
          }}
        >
          Logout
        </button>

        <div ref={alertRef} style={{background: "green", padding: "0 10px", borderRadius: "3px"}}>
        Alert
        </div>
      </div>

      <div style={{ display: "flex", gap: "5px", alignItems: "baseline" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "20px",
            width: "25%",
            height: "78vh",
            overflow: "auto"
          }}
        >
          {data && (
            <QueuedMessageUsers
              visitorList={data}
              loadMessageHistory={loadMessageHistory}
            />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", 
        justifyContent: 'space-around', alignItems: 'baseline', width: '70%'}}>
        <div
          style={{
            background: "white",
            color: "black",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {message ? (
            <ChatMessage
              messages={message}
              addMessage={sendMessageToLiveChat}
            />
          ) : (
            <p>Show chats here</p>
          )}
        </div>
         {(message) && (<div style={{display: "flex", width: "100%", padding: "0 5px", gap: "10px"}}>
                  <input placeholder="Enter your message" value={newMessage} style={{
          width: '95%', padding:'10px', background: 'white', color: 'black',
          border: 'none'
          }} onChange={handleChange}  onKeyUp={(e)=> {callAddMessage(e)}}/>
          <button onClick={handleSubmit}>Send</button>
          </div>)}
          </div>
      </div>
    </>
  );
}

export default React.memo(Main);
