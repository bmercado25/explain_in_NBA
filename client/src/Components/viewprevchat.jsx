import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./test.css"

const Test = () => {
  const words = [
    'Brick', 'Fraud', 'Washed', 'Mickey Ring', 'Bubble', 
    'Superteam', 'Ratio', 'Legacy', 'Mid', 'Cooked',
    'Agenda', 'Casual', 'Burner', 'Carry', 'Goat',
    'LeGOAT', 'Steff', 'Jokgod', 'Kuminga', 'Fraudulent',
    'Spida', 'Dpooy', 'MVP', 'Statpad',
    'Rimrunner', 'Hooper', 'Pipedream'
  ];
  
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const [chatData, setChatData] = useState([]);
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate('/');
  };

  const handleprev = (entry) => {
    navigate('/', {state: {selectedEntry: entry}} )
  }

  const getPrevChat = async () => {
    try {
      const deviceID = 1; // Make sure this matches your stored deviceID TODO, i think im gonna keep this as a constant for now to implement later;
      const getResponse = await fetch(`http://localhost:8080/api/getChatHistory?deviceID=${deviceID}`);
      if (!getResponse.ok) throw new Error("Error fetching chat history");
      const getData = await getResponse.json();
      console.log(getData);
      setChatData(getData.history || []); // Set the fetched data directly
      //console.log(chatData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getPrevChat();
  }, []);

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <h2>See What Everyone Else has Been Explaining in NBA Terms</h2>
            <button className="main-button" onClick={handleBackButton}>
              <span className="material-symbols-outlined">circle</span>
            </button>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          {chatData.length > 0 ? (
            <div className="chat-container">
              {chatData.slice().map((session, index) => (
                <div key={index} className="chat-session">
                  <div className="prev-chat-header"><h3>Chat {getRandomWord()}</h3></div>
                  <ul>
                    {Array.isArray(session.history) ? (
                      session.history.slice(0, 10).map((entry, i) => {
                        const entryrole = entry.role == "r" ? "User" : "Bot";
                        return (
                          <div className="chat-box" key={i}>
                            <div className="chat-message">
                              {entryrole}:&nbsp;{entry.text}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <li>No messages</li>
                    )}
                  </ul>
                  <button className="continue-button" onClick={() => handleprev(session)}>
                    Continue this Conversation
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No previous chat history found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
