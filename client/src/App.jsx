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

        // Pre-prompt: Add a message at the beginning of the chat history that gives context to the model
    const prePrompt = {
      role: "system", 
      text: "You are a helpful assistant who explains any concept, breifly in specifically NBA terms after the 1980s, but dont mention that; in terms of history of players, events, statistics, as applicable as possible. If you are asked to elaborate, you will, but breifly as well. If you can apply concepts to obscure players, or controversies associated with players, do that as well. If you can compare it to an event, situation, statistical spread etc. do that first."
    };

    // Add the pre-prompt to the start of the history
    history = [{ role: "system", text: prePrompt.text }, ...history];


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
      console.log(data);

      if(!response.ok) throw new Error(data.error.message || "Error");

      // update model response in chat window
      // const modelResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

      const modelResponse = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Replace **text** with <b>text</b>
      .replace(/^\* /gm, "") // Remove bullet points represented by "* " at the beginning of lines
      .trim();
    
    

      updateHistory(modelResponse);
    } catch(error){
      console.log(error);
    }
  };
  
 const handleMainButtonClick = async () => {
    try {
      
      const postRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory })  // Send entire chat history
      };

      const postChatHistory = await fetch("http://localhost:8080/api/PostChatHistory", postRequestOptions); // Adjust URL if needed
      const postData = await postChatHistory.json();

      if (!postChatHistory.ok) {
        throw new Error(postData.error.message || "Error sending chat history");
      }

      // Step 2: Fetch the same data from the backend via GET request after POST
      const getResponse = await fetch("http://localhost:8080/api/getChatHistory", { method: "GET" });

      if (!getResponse.ok) {
        throw new Error("Error fetching chat history");
      }

      const getData = await getResponse.json();
      console.log(getData);

      console.log("Chat history sent successfully:", postData);

    } catch (error) {
      console.error("Error:", error);
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
        <button className = "main-button" onClick={handleMainButtonClick}>
        <span className="material-symbols-outlined">circle</span> </button> 
        </div>

        <div className="chat-body" ref={chatBodyRef}> {/*Body of chat bot*/} 
          <div className ="message message-l"> {/*chat elements from chatbot, left-hand*/} 
          <p className = "message-text"> {/*contents*/} 
            Hello! I am the explain in NBA terms bot! Ask me anything and I'll explain it in NBA terms.<br />
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