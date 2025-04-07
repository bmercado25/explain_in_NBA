/**/

import React, { useRef } from 'react'

const ChatForm = ({setChatHistory}) => {
    const inputRef = useRef();

    const handleSumbission = (e) => {
        e.preventDefault();
        const userInput = inputRef.current.value.trim();
        if(!userInput) return;
        inputRef.current.value = "";

        {/*Chat history prop*/}
        setChatHistory(history => [...history, {role : "r", text: userInput}]);

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