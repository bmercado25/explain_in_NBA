/*Resources used V1:
https://react.dev/learn
https://chatgpt.com/
https://www.youtube.com/watch?v=5fiXEGdEK10&t=1105s -> App structure based off this tutorial
*/


import Icon from "./Components/icon"

const App = () => {
  return (
    <div className = "container">
      <div className = "chatbot-popup"> {/*Chat Message Screen Div*/}
        <div className = "chat-header"> {/*Chat header Div*/}
          <div className = "header-info"> {/*Chat header contents*/}
            <Icon />
            <h2 className = "logo-t">Explain this in NBA terms</h2>
          </div>
        <button className = "main-button">
        <span className="material-symbols-outlined">circle</span> </button> 
        </div>

        <div className="chat-body"> {/*Body of chat bot*/} 
          <div className ="message message-l"> {/*chat elements from chatbot, left-hand*/} 
          <p className = "message-text"> {/*contents*/} 
            Placeholder bot<br />
          </p>
          <div className ="message message-r"> {/*chat elemets from user, right-hand*/} 
          <p className = "message-text">
            placeholder Input <br /> 
          </p>
          
          </div>
          </div>
        <div className="chat-foot"> {/*begin footer, body of where message is inputed by user*/}
        <form action="#" className="chat-form"> {/*message form, input*/}
          <input type="text" placeholder="Message..." 
          className="message-input" required /> {/*message form button, for submission*/}
          <button className="material-symbols-outlined">circle</button> 
        </form>
        </div>
        </div>
      </div> 
    </div>
  );
};

export default App;