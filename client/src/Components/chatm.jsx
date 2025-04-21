import React from "react"

const ChatMessage = ({ chat }) => {
    return (
        <div className = {`message message-${chat.role === "l" ? 'l' : 'r'}`}> {/*chat elemets from user, right-hand*/} 
          {/*chat.role === "l"*/}
          <p className="message-text" dangerouslySetInnerHTML={{ __html: chat.text }} />
          </div>
        
    )

}

export default ChatMessage