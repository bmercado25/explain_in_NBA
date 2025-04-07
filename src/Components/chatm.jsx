import React from "react"

const ChatMessage = ({ chat }) => {
    return (
        <div className = {`message message-${chat.role === "mode" ? 'l' : 'r'}`}> {/*chat elemets from user, right-hand*/} 
          {chat.role === "l"}
          <p className = "message-text"> {chat.text}</p>
          </div>
        
    )

}

export default ChatMessage