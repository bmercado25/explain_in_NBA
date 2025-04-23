import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const Test = () => {
    const [chatData, setChatData] = useState([]);  // Use a different state name
    const navigate = useNavigate();

    const handleBackButton = () =>{
        navigate('/');
    }

    const getPrevChat = async () => {
        try {
            const getResponse = await fetch("http://localhost:8080/api/getChatHistory");
            if (!getResponse.ok) throw new Error("Error fetching chat history");

            const getData = await getResponse.json();
            console.log(getData);

            // Store the fetched data in state
            setChatData(getData.storedBody.chatHistory); 
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Optionally use useEffect to fetch data when the component mounts
    useEffect(() => {
        getPrevChat();
    }, []);

    return (
        <div>
            <button onClick={handleBackButton} style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px' }}></button>
            <h1>Previous Chat History</h1>
            <div>
                {chatData.length > 0 ? (
                    <ul>
                        {chatData.map((chat, index) => (
                            <li key={index}>{chat.text}</li> // Assuming `text` is the property you're displaying
                        ))}
                    </ul>
                ) : (
                    <p>No previous chat history found.</p>
                )}
            </div>
        </div>
    );
};

export default Test;