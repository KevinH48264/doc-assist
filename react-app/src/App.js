import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('Waiting for submit button to be pressed');
  const [modelIndex, setModelIndex] = useState(Math.floor(Math.random() * (100 - 1) + 1))
  const [openAIKey, setOpenAIKey] = useState('')
  const URL = 'https://opendoc-conirvxfeq-uc.a.run.app'


  function embedClick() {
    console.log(text);
    setStatus("Loading")
    // todo: update model_index so it's not always 0
    setModelIndex(Math.floor(Math.random() * (100 - 1) + 1))
    const data = { model_index: modelIndex, text: text, openai_key: openAIKey };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(data)
    };

    fetch(`${URL}/embed`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESULT HERE: ", data);
        setStatus("Ready for you to ask a question!")
    });
  }

function queryClick() {
  console.log(query);
  setAnswer("Response: Loading")
  // todo: update model_index so it's not always 0
  const data = { model_index: modelIndex, prompt: query, type: "text" };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(data)
  };

  fetch(`${URL}/query`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("QUERY RESPONSE HERE: ", data);
      console.log(data["Response"])
      console.log(data["Response"]["response"])
      setAnswer("Response: " + data["Response"]["response"])
  });
}


  return (
    <div className="App" style={{ display: "flex", flexDirection: "row"}}>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px", width: "50%"}}>
        <p>Enter text or a URL you'd like to ask questions about</p>
        <textarea style={{height: "50vh"}} onChange={(e) => setText(e.target.value)} />
        <div style={{display: "flex", alignItems: "center"}}>
          <p>Use OpenAI API Key [optional, but better results]:</p>
          <textarea style={{height: "30px", marginLeft: "10px" }} onChange={(e) => setOpenAIKey(e.target.value)} />
        </div>
        <button style={{ height: "50px", marginTop: "15px"}} onClick={embedClick}>Submit</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px", width: "50%"}}>
        <p>Status: {status}</p>
        <textarea style={{height: "25vh"}} onChange={(e) => setQuery(e.target.value)} />
        <button style={{ height: "50px", marginTop: "15px"}} onClick={queryClick}>Ask Question</button>
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
