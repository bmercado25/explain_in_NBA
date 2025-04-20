import Icon from "./Components/icon"
import ChatForm from "./Components/chatf"
import ChatMessage from "./Components/chatm";
import { useState, useEffect, useRef } from "react";

/* Resources used V1:
https://react.dev/learn
https://chatgpt.com/
https://www.youtube.com/watch?v=5fiXEGdEK10&t=1105s -> App structure based off this tutorial
*/

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null); 

  // This is your existing generateBotResponse function which remains unchanged
  const generateBotResponse = async (history) => {
    // Helper to update chat
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking.."), { role: "l", text }]);
    };

    history = history.map(({ role, text }) => ({
      role: role === "r" ? "user" : "model", // Maps r and l roles to required formatting for API
      parts: [{ text }]
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.error.message || "Error");

      const modelResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(modelResponse);
    } catch (error) {
      console.log(error);
    }
  };

  // NEW function for handling the POST and GET API calls when the button is clicked
  const handleMainButtonClick = async () => {
    try {
      // Step 1: Send chat history to the backend via POST request
      const postRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory })  // Send entire chat history
      };

      const postResponse = await fetch("http://localhost:8000/api/sendChatHistory", postRequestOptions); // Adjust URL if needed
      const postData = await postResponse.json();

      if (!postResponse.ok) {
        throw new Error(postData.error.message || "Error sending chat history");
      }

      console.log("Chat history sent successfully:", postData);

      // Step 2: Fetch the same data from the backend via GET request after POST
      const getResponse = await fetch("http://localhost:8000/api/getChatHistory", { method: "GET" });

      if (!getResponse.ok) {
        throw new Error("Error fetching chat history");
      }

      const getData = await getResponse.json();
      console.log("Fetched chat history from API:", getData);

      // You can decide how to handle the fetched data (e.g., display it or update the state)
      // For now, let's just update the chat history with the fetched response
      setChatHistory(getData.chatHistory || []);

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
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <Icon />
            <h2 className="logo-t">Explain this in NBA terms</h2>
          </div>
          <button className="main-button" onClick={handleMainButtonClick}> {/* Main button now calls handleMainButtonClick */}
            <span className="material-symbols-outlined">circle</span>
          </button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          <div className="message message-l">
            <p className="message-text">
              Hello! I am the explain in NBA terms bot! Ask me anything and I'll explain it in NBA terms.<br />
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-foot">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}  // This remains unchanged
          />
        </div>
      </div>
    </div>
  );
};

export default App;