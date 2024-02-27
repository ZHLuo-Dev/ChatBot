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
    // 使用map函数来生成每个分类的按钮，并用React.Fragment来包裹，以避免额外的DOM元素
    const categoriesButtons = (
      <React.Fragment>
        {Object.keys(questionsData.categories).map((category, index) => (
          <React.Fragment key={index}>
            {/* 这里使用button标签并在onClick中调用handleCategoryClick，传递category作为参数 */}
            <button key={category} onClick={() => handleCategoryClick(category)} className="question">
            {category}</button>
            {/* 在按钮之间添加换行符 */}
            <br />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  
    // 创建一个包含所有分类按钮的消息，并将其添加到messages状态
    sendMessage(<div>{categoriesButtons}</div>, "bot",true);
  };
  const [canLeaveMessage, setCanLeaveMessage] = useState(false);

  const leaveMessage = () => {
    sendMessage("Please leave your message in the chat.", "bot",true);
    setCanLeaveMessage(true); // 启用留言模式
    setShowOptions(false);
  };

  const handleQuestionClick = (category, question) => {
    const answer = questionsData.categories[category].answers[question];
    // 使用React元素而不是字符串来包含问题和答案，这样可以直接插入<br>来换行
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

  const handleSendClick = async () => {
    if (input.trim()) {
      if (canLeaveMessage) {
        // 封装留言内容
        const messageContent = { text: input.trim(), timestamp: new Date().toISOString() };
        try {
          const response = await fetch('http://localhost:3001/api/leaveMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageContent),
          });
  
          if (response.ok) {
            // 留言成功
            console.log("Message sent successfully");
            sendMessage(input.trim(), "user", true); // 确保这一行存在，以将留言添加到对话中
            sendMessage("Thank you for your feedback!", "bot", true);
          } else {
            // 留言失败
            console.error("Failed to send message");
            sendMessage("Sorry, we were unable to save your message. Please try again later.", "bot", true);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          sendMessage("Sorry, we were unable to save your message. Please try again later.", "bot", true);
        }
  
        setCanLeaveMessage(false); // 重置留言模式
        setInput(''); // 清空输入框
      } else {
        // 正常发送用户消息
        sendMessage(input.trim(), "user", true);
      }
  
      if (!showOptions) {
        setShowOptions(true); // 重置选项显示状态
      }
    }
  };
  

  const sendMessage = (content, sender, useTypingEffect = false) => {
    const newMessage = { 
      id: Date.now(),
      text: content,  
      sender: sender, 
      timestamp: timestamp,
      isTypingEffect: useTypingEffect, // 新增属性，标记是否使用打字机效果
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const handleCategoryClick = category => {

    const questions = questionsData.categories[category].questions;
    const questionsText = questions.map((question, index) => (
      <div key={`${category}-${index}`} // 确保 key 的唯一性
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
    if (e.key === 'Enter' && input.trim()) { // 检查是否为回车键并且输入非空
      handleSendClick(); // 使用已有的发送按钮点击处理逻辑
      e.preventDefault(); // 防止回车键默认行为（例如，提交表单）
    }
  }}
  placeholder="Type a message..."
/>
  </div>
      <footer className="App-footer">
        <a href="/game-website">Navigate to game website</a>
        <a href="/contacts">Contacts</a>
        <a href="/more-info">More Info</a>
      </footer>
    </div>
  );
}

export default App;
