import React, { useState, useEffect } from "react";
import "./App.css";
import { createParser } from "eventsource-parser";

function App() {
  const [text, setText] = useState("TEMPORARY TEXT");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState(
    "Waiting for submit button to be pressed"
  );
  const [modelIndex, setModelIndex] = useState(
    Math.floor(Math.random() * (100 - 1) + 1)
  );
  const [openAIKey, setOpenAIKey] = useState("");
  const URL = "https://opendoc-conirvxfeq-uc.a.run.app";

  function embedClick() {
    console.log(text);
    setStatus("Loading...");
    // todo: update model_index so it's not always 0
    setModelIndex(Math.floor(Math.random() * (100 - 1) + 1));
    const data = { model_index: modelIndex, text: text, openai_key: openAIKey };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(`${URL}/embed`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESULT HERE: ", data);
        setStatus("Ready for you to ask a question!");
      });
  }

  function queryClick() {
    console.log(query);
    setAnswer("Response: Loading");
    // todo: update model_index so it's not always 0
    const data = { model_index: modelIndex, prompt: query, type: "text" };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(`${URL}/query`, options)
      .then((response) => response.json())
      .then((data) => {
        setAnswer("Response: " + data["Response"]["response"]);
      });
  }

  // for testing the chatgpt server
  useEffect(() => {
    // TODO: Edit this as necessary
    let data = {
      website_text: "",
      prompt: "hi",
      chat_history: [],
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(data),
    };

    // TODO: Edit this URL
    fetch(`http://localhost:8080/chat_stream`, options).then(
      async (response) => {
        console.log("Calling OpenAI API");
        var newText = "";

        // TODO: Edit setText accordingly
        setText("");

        // checks for errors
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(
            error
              ? JSON.stringify(error)
              : `${response.status} ${response.statusText}`
          );
        }

        // helper function to parse through each stream event and update new text
        const parser = createParser((event) => {
          if (event.type === "event") {
            if (event.data !== "[DONE]") {
              var eventData = JSON.parse(event.data);
              if ("content" in eventData.choices[0].delta) {
                newText += eventData["choices"][0]["delta"]["content"];

                // TODO: Edit setText accordingly
                setText(newText);
              }
            }
          }
        });

        // catches chunks from stream
        for await (const chunk of streamAsyncIterable(response.body)) {
          const event = new TextDecoder().decode(chunk);
          parser.feed(event);
        }
      }
    );

    // helper function to read from stream until done
    async function* streamAsyncIterable(stream) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    }
  }, []);
  console.log("HELLO", process.env.TEST);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "row" }}>
      <p>{text}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "50px",
          width: "50%",
        }}
      >
        <p>Enter text or a URL you'd like to ask questions about</p>
        <textarea
          style={{ height: "50vh" }}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Use OpenAI API Key [optional, but better results]:</p>
          <textarea
            style={{ height: "30px", marginLeft: "10px" }}
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
        </div>
        <button
          style={{ height: "50px", marginTop: "15px" }}
          onClick={embedClick}
        >
          Submit
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "50px",
          width: "50%",
        }}
      >
        <p>Status: {status}</p>
        <textarea
          style={{ height: "25vh" }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          style={{ height: "50px", marginTop: "15px" }}
          onClick={queryClick}
        >
          Ask Question
        </button>
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
