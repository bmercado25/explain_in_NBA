/*Resources used V1:
https://react.dev/learn
https://chatgpt.com/
https://www.youtube.com/watch?v=5fiXEGdEK10&t=1105s -> App structure based off this tutorial
*/


import Icon from "./Components/icon"
import ChatForm from "./Components/chatf"
import ChatMessage from "./Components/chatm";
import { useState, useEffect, useRef} from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null); 

  const generateBotResponse = async(history) => {

    //Helper to update chat
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking.."), {role: "l", text}]);
    }


    history = history.map(({ role, text }) => ({
      role: role === "r" ? "user" : "model", //Maps r and l roles to required formatting for API
      parts: [{ text }]
    }));
     {/*format chat history for API call*/}

    const requestOptions ={
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({contents: history})
    };

    try{
      {/* API CALL */}
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if(!response.ok) throw new Error(data.error.message || "Error");

      // update model response in chat window
      const modelResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(modelResponse);
    } catch(error){
      console.log(error);
    }
  };

    // Scroll to bottom whenever chatHistory updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

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

        <div className="chat-body" ref={chatBodyRef}> {/*Body of chat bot*/} 
          <div className ="message message-l"> {/*chat elements from chatbot, left-hand*/} 
          <p className = "message-text"> {/*contents*/} 
            Placeholder bot<br />
          </p>
        </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

        </div>
        <div className="chat-foot"> {/*begin footer, body of where message is inputed by user*/}
        <ChatForm chatHistory={chatHistory} setChatHistory = {setChatHistory} generateBotResponse = {generateBotResponse} />
        </div>
      </div> 
    </div>
  );
};

export default App;