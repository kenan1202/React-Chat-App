import React, {useState} from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

let result = '';

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    if(h < 10) {
        h = "0" + h;
    }
    if(h < 12) {
        result = h + ":" + m + " AM";
    }
    if(h > 12) {
        result = (h - 12) + ":" + m + " PM";
    }
}



function App() {
  const [outputs, setOutputs] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [writer, setWriter] = useState('');


  const submitMessage = () => {
    startTime();
    socket.emit('message', { 
      message: message,
      writer: writer,
      date: result
    });
   socket.emit('messageSelf', {
       writer: 'You',
       message: message,
       date: result
    });
  }


  socket.on('message', function(data) {
    setFeedback('');
    setOutputs(outputs.concat({outputWriter: data.writer, outputMessage: data.message, outputDate: data.date, outputKey: Math.random() }));
  });
  
  socket.on('messageSelf', function(data) {
    setOutputs(outputs.concat({outputWriter: data.writer, outputMessage: data.message, outputDate: data.date, outputKey: Math.random() }));
  });



  const pressMessage = () => {
    socket.emit('typing', writer);
  }
  

  socket.on('typing', function(data) {
    setFeedback(data + ' is typing a message...');
  });

  return (
    <div id = "chatBox">
      <div className = "messageScreen">
        <div className = "output">
        {outputs.map((output) => (
            <p className = "messageInfo" key = {output.outputKey} ><strong>{output.outputWriter}:</strong>{output.outputMessage} <em>{output.outputDate}</em></p>
        ))}
        </div>
        <div className = "feedback">{feedback}</div>
      </div>
      
      <div className = "typeScreen">
        <input type = "text" className = "messageWriter" placeholder = "Type your name..." onChange = {e => setWriter(e.target.value)}></input>
        <input type = "text" className = "message" placeholder = "Type message..." onKeyPress = {pressMessage} onChange = {e => setMessage(e.target.value)}></input>
        <button type = "button" className = "btn" onClick = {submitMessage}>Submit</button>
      </div>
    </div>
  );
}

export default App;
