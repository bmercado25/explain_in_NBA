import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const [chatData, setChatData] = useState([]);
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate('/');
  };

  const getPrevChat = async () => {
    try {
      const deviceID = 1; // Make sure this matches your stored deviceID
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
        <button onClick={handleBackButton} style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px' }}>
          Back
        </button>
        <h1>Previous Chat History</h1>
        <div style={{ padding: "20px" }}>
          {chatData.length > 0 ? (
            chatData.map((session, index) => (
              <div key={index} style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #ccc" }}>
                <h3>Chat #{session.index ?? index}</h3>
                <ul>
                  {Array.isArray(session.history) ? (
                    session.history.map((entry, i) => (
                      <li key={i}><strong>{entry.role}:</strong> {entry.text}</li>
                    ))
                  ) : (
                    <li>No messages</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p>No previous chat history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;