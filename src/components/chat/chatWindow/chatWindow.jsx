import React, { useRef, useState } from "react";
import moment from "moment";
const ChatMessage = ({ messages, addMessage}) => {
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef();
    const messageComponent = (type, val) => {
        messagesEndRef && messagesEndRef.current?.scrollIntoView({  block: "end"})
        switch (type) {
            case 'uj':
                return (<span style={{fontSize: '12px', color: 'blue'}}>{val?.u.username + " " + "Has joined"}</span>)
            case 'livechat-started':
                return (<span style={{fontSize: '12px', color: 'green'}}>{val?.u.username} <span style={{fontSize: '12px', color: '#0000007d', padding: '0 8px'}}>Chat started {moment(typeof(val?.ts) == 'string' ? val?.ts : val?.ts.$date).format('MMMM Do YYYY, h:mm A')}</span></span>)
            default :
                return (<div style={{display: 'flex', width: 'max-content', alignItems: 'center'}}>
                <div style={{padding: '9px 16px', background: (val?.u?.name) ? 'green' : 'blue', 
                color: 'white', borderRadius: '4px'}}>{(val?.u?.name) ? val?.u?.name.charAt(0).toUpperCase() : val?.u?.username.charAt(0).toUpperCase()}
                </div>
                 <div style={{display: 'flex', flexDirection: 'column', width: 'max-content', 
                 padding: '10px', borderRadius: '10px'}}>
                 <span style={{fontSize: '15px', color: 'black', fontWeight: '600'}}>{val?.u.username} <span style={{fontSize: '12px', color: '#0000007d', padding: '0 8px'}}>{moment(typeof(val?.ts) == 'string' ? val?.ts : val?.ts.$date).format('MMMM Do YYYY, h:mm A')}</span></span>
                 <span>{val?.msg}</span>
                 </div>

                </div>)
        }
    }

    const handleChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage(newMessage);
        setNewMessage("");
    };

    return (
        <div>
            <div ref={messagesEndRef} className={'message-div'}>
                {messages.map((message) => (
                    <>
                        {messageComponent(message?.t, message)}
                    </>
                ))}
            </div>
        </div>
    );
};

export default ChatMessage;