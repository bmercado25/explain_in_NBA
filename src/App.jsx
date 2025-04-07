/*Resources used V1:
https://react.dev/learn
https://chatgpt.com/
https://www.youtube.com/watch?v=5fiXEGdEK10&t=1105s -> App structure based off this tutorial
*/


import Icon from "./Components/icon"
import ChatForm from "./Components/chatf"
import ChatMessage from "./Components/chatm";
import { useState } from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className = "container">
      <div className = "chatbot-popup"> {/*Chat Message Screen Div*/}
        <div className = "chat-header"> {/*Chat header Div*/}
          <div className = "header-info"> {/*Chat header contents*/}
            <Icon />
            <h2 className = "logo-t">Explain this in NBA terms</h2>
          </div>
        <button className = "main-button">
        <span className="material-symbols-outlined">circle</span> </button> 
        </div>

        <div className="chat-body"> {/*Body of chat bot*/} 
          <div className ="message message-l"> {/*chat elements from chatbot, left-hand*/} 
          <p className = "message-text"> {/*contents*/} 
            Placeholder bot<br />
          </p>

          {chatHistory.map((chat, index) => (
            <ChatMessage key ={index} chat ={chat} / > ))}

          </div>
        <div className="chat-foot"> {/*begin footer, body of where message is inputed by user*/}
        <ChatForm setChatHistory = {setChatHistory} />
        </div>
        </div>
      </div> 
    </div>
  );
};

export default App;