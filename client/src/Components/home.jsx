import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Icon from "./icon";
import ChatForm from "./chatf";
import ChatMessage from "./chatm";
import Test from "./viewprevchat";
import { useLocation } from 'react-router-dom'



const Home = () => {
  const backend = import.meta.env.VITE_BACKEND_URL; 

  const navigate = useNavigate();
  const location = useLocation();
  const [chatHistory, setChatHistory] = useState(location.state?.selectedEntry.history || []);
  const chatBodyRef = useRef(null);
  const [thinking, setThinking] = useState(false);


  const generateBotResponse = async (history) => {
    let thinkingInterval;
    setThinking(true);

    // Animate the dots
    thinkingInterval = setInterval(() => {
      setChatHistory(prev => {
        return prev.map(msg =>
          msg.text.startsWith("Thinking") && msg.role === "l"
            ? { ...msg, text: msg.text.length < 12 ? msg.text + "." : "Thinking" }
            : msg
        );
      });
    }, 500);
  
    const updateHistory = (text) => {
      clearInterval(thinkingInterval);
      setThinking(false);
  
      setChatHistory(prev => [
        ...prev.filter(msg => !(msg.role === "l" && msg.text.startsWith("Thinking"))),
        { role: "l", text }
      ]);
    };

    const prePrompt = {
      role: "system",
      text: "You are a helpful assistant who explains any concept, briefly in specifically NBA terms after the 1980s, but don't mention that; in terms of history of players, events, statistics, as applicable as possible. If you are asked to elaborate, you will, but briefly as well. If you can apply concepts to obscure players, or controversies associated with players, do that as well. If you can compare it to an event, situation, statistical spread etc. do that first. Make sure you separate the information often with single returns, so it's easily readable"
    };

    history = [{ role: "system", text: prePrompt.text }, ...history];

    history = history.map(({ role, text }) => ({
      role: role === "r" ? "user" : "model",
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
      if (!response.ok) throw new Error(data.error.message || "Error");

      const modelResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/^\* /gm, "")
        .trim();

      updateHistory(modelResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMainButtonClick = async () => {
    const ID = 1;

    try {
      const postRequestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          deviceID: ID,
          history: chatHistory })
      };
      const postChatHistory = await fetch(`${backend}/api/PostChatHistory`, postRequestOptions);
      const postData = await postChatHistory.json();
      if (!postChatHistory.ok) throw new Error(postData.error.message || "Error sending chat history");
      

      const getResponse = await fetch(`${backend}/api/getChatHistory?deviceID=${ID}`);
      if (!getResponse.ok) throw new Error("Error fetching chat history");

      const getData = await getResponse.json();
      console.log(getData);
      /*console.log("Chat history sent successfully:", postData);*/

      navigate('/viewprevchat');
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
          <button className="main-button" onClick={handleMainButtonClick}>
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
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default Home;