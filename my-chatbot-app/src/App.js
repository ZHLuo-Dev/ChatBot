import React, { useState } from 'react';
import './App.css';
import questionsData from './questionsData';
import TypewriterEffect from './type';
function generateTimestamp() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function App() {
  const timestamp = generateTimestamp();
  const showCategories = () => {
    const categoriesButtons = (
      <React.Fragment>
        {Object.keys(questionsData.categories).map((category, index) => (
          <React.Fragment key={index}>
            <button key={category} onClick={() => handleCategoryClick(category)} className="question">
            {category}</button>
            <br />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  
 
    sendMessage(<div>{categoriesButtons}</div>, "bot",true);
  };
  const [canLeaveMessage, setCanLeaveMessage] = useState(false);

  const leaveMessage = () => {
    sendMessage("Please leave your message in the chat.", "bot",true);
    setCanLeaveMessage(true); 
    setShowOptions(false);
  };

  const handleQuestionClick = (category, question) => {
    const answer = questionsData.categories[category].answers[question];
    const questionAndAnswerElement = (
      <div>
        <strong>{question}</strong>
        <div className="answer-text">{answer}</div>
      </div>
    );
    sendMessage(questionAndAnswerElement, "bot", true);
  };
  
  const [messages, setMessages] = useState([
    { 
      id: 1,    
      text: (
        <div>
        <div>Hello! I'm your virtual robot, my name is Bob. How can I help you today?</div>
        <div>Here are following options:</div>
        <div className="start-choices" onClick={showCategories}>Common Questions Categories</div>
        <div className="start-choices" onClick={leaveMessage}>I wanna Leave a Message</div>
      </div>
    ), 
      sender: "bot", 
      timestamp: timestamp
    },
  ]);
 
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const handleSendClick = async () => {
    if (input.trim()) {
      if (canLeaveMessage) {
        const messageContent = { text: input.trim(), timestamp: new Date().toISOString() };
        try {
          const response = await fetch(`${BACKEND_URL}/api/leaveMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageContent),
          });
  
          if (response.ok) {
            console.log("Message sent successfully");
            sendMessage(input.trim(), "user", true); 
            sendMessage("Thank you for your feedback!", "bot", true);
          } else {
            console.error("Failed to send message");
            sendMessage("Sorry, we were unable to save your message. Please try again later.", "bot", true);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          sendMessage("Sorry, we were unable to save your message. Please try again later.", "bot", true);
        }
  
        setCanLeaveMessage(false); 
        setInput('');
      } else {
 
        sendMessage(input.trim(), "user", true);
        setInput('');
        
      }
  
      if (!showOptions) {
        setShowOptions(true); 
      }
    }
  };
  

  const sendMessage = (content, sender, useTypingEffect = false) => {
    const newMessage = { 
      id: Date.now(),
      text: content,  
      sender: sender, 
      timestamp: timestamp,
      isTypingEffect: useTypingEffect, 
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const handleCategoryClick = category => {

    const questions = questionsData.categories[category].questions;
    const questionsText = questions.map((question, index) => (
      <div key={`${category}-${index}`} 
           className="question" 
           onClick={() => handleQuestionClick(category, question)}>
        {question}
      </div>
    ));

    sendMessage(<div>{questionsText}</div>, "bot", false);
  };
  

  return (
<div className="App">
  <header className="App-header">
  <div className="App-header-text">
      <h1>Chat with our bot</h1>
    </div>
  </header>
  <div className="chat-window">
    {messages.map(message => (
      <div key={message.id} className={`message ${message.sender}`}>
        <img src={message.sender === 'bot' ? "images/robot.png" : "images/client.png"} alt={message.sender} className="avatar" />
        <div className={`message-text ${message.sender === 'bot' ? "bot-text" : "user-text"}`}>
        {message.sender === 'user' && message.isTypingEffect ? (
        <TypewriterEffect text={message.text} />
      ) : (
        <div>{message.text}</div>
      )}
          <span className="timestamp">{message.timestamp}</span>
        </div>
      </div>
    ))}
  </div>
  <div className="input-area">
  <input
  type="text"
  value={input}
  onChange={e => setInput(e.target.value)}
  onKeyDown={e => {
    if (e.key === 'Enter' && input.trim()) { 
      handleSendClick(); 
      e.preventDefault(); 
    }
  }}
  placeholder="Type a message..."
/>
<button onClick={handleSendClick} className="send-button">Send</button>
  </div>
      <footer className="App-footer">
      <a href="https://zl-2023.com" target="_blank" rel="noopener noreferrer">Navigate to game website</a>
      </footer>
    </div>
  );
}

export default App;
