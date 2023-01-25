import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const URL = 'https://opendoc-conirvxfeq-uc.a.run.app'


  function embedClick() {
    console.log(text);
    // todo: update model_index so it's not always 0
    const data = { model_index: 0, text: text };

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
    });
  }

//   {
//     "model_index" : 0,
//     "prompt" : "what are the main takeaway?",
//     "type" : "text"
// }

function queryClick() {
  console.log(query);
  // todo: update model_index so it's not always 0
  const data = { model_index: 0, prompt: query, type: "text" };

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
      setAnswer(data["Response"]["response"])
  });
}


  return (
    <div className="App" style={{ display: "flex", flexDirection: "row"}}>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px", width: "50%"}}>
        <textarea style={{height: "50vh"}} onChange={(e) => setText(e.target.value)} />
        <button style={{ height: "50px", marginTop: "15px"}} onClick={embedClick}>Submit</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px", width: "50%"}}>
        <textarea style={{height: "50vh"}} onChange={(e) => setQuery(e.target.value)} />
        <button style={{ height: "50px", marginTop: "15px"}} onClick={queryClick}>Ask Question</button>
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
