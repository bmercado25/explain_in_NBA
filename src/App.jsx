import Icon from "./Components/icon"

const App = () => {
  return (
    <div className = "container">
      <div className = "chatbot-popup">
        <div className = "chat-header">
          <div className = "header-info">
            <Icon />
            <h2 className = "logo-t">Explain this in NBA terms</h2>
          </div>
        <button className = "main-button">
        <span className="material-symbols-outlined">circle</span> </button> 
        </div>

        <div className="chat-body"> {/*Body*/}
          <div className ="message message-l">
          <p className = "message-text">
            Placeholder bot<br />
          </p>
          <div className ="message message-r">
          <p className = "message-text">
            placeholder Input <br /> 
          </p>
          
          </div>
          </div>
        <div className="chat-foot"> {/*footer*/}
        <form action="#" className="chat-form">
          <input type="text" placeholder="Message..." 
          className="message-input" required />
          <button className="material-symbols-outlined">circle</button> 
        </form>
        </div>
        </div>
      </div> 
    </div>
  );
};

export default App;