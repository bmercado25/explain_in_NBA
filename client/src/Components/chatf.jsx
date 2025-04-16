/**/

import React, { useRef } from 'react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const handleSumbission = (e) => {
        e.preventDefault();
        const userInput = inputRef.current.value.trim();
        if(!userInput) return;
        inputRef.current.value = "";

        {/*Chat history prop*/}
        setChatHistory(history => [...history, {role : "r", text: userInput}]);

        {/* Bot handling logic, calls bot message and then generate bot response function, present in app file */}
        setTimeout(() => {
        setChatHistory((history) => [...history, {role : "l", text: "Thinking.."}]);

        generateBotResponse([...chatHistory, {role : "r", text: userInput}]);
    } , 600)
    };

    return(
        <form action="#" className="chat-form" onSubmit={handleSumbission}> {/*message form, input*/}
        <input ref = {inputRef} type="text" placeholder="Message..." 
        className="message-input" required /> {/*message form button, for submission*/}
        <button className="material-symbols-outlined">circle</button> 
      </form>
    )

}

export default ChatForm