import { Box } from "@chakra-ui/react";
import { createParser } from "eventsource-parser";
import React, { useState } from "react";
import { streamAsyncIterable } from "../../utils";
import { Body } from "./Body";
import { ChatInput } from "./ChatInput";

interface OpenProps {
  extractedText: string;
  setIsOpened: any;
  dataResponse: string;
  setDataResponse: any;
}

export const Open: React.FC<OpenProps> = ({ extractedText, setIsOpened, dataResponse, setDataResponse }) => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const fetchData = async () => {
    console.log("FETCHING!")
    setLoading(true);
    console.log("Extracted Text: ", extractedText);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        website_text: extractedText,
        prompt: inputText,
        chat_history: [],
        // namespace:
      }),
    };

    // TODO: Edit this URL
    const response = await fetch(
      `https://opendoc-conirvxfeq-uc.a.run.app/chat_stream`,
      // "http://127.0.0.1:8080/chat_stream",
      options as any
    );
    console.log("Calling OpenAI API", response);

    // --- for testing with pdf
    // const data = await response.json();
    // setAnswer(data.answer);
    // console.log(data);
    // ----------------------

    let newText = "";

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
            setDataResponse(newText);
          }
        }
      }
    });

    // catches chunks from stream
    for await (const chunk of streamAsyncIterable(response.body)) {
      console.log(chunk)
      const event = new TextDecoder().decode(chunk);
      parser.feed(event);
    }

    setLoading(false);
  };

  return (
    <Box
      borderRadius={"10px 0px 0px 10px"}
      bg={"#202123"}
      w={"300px"}
      border={"1px"}
      borderColor={"black"}
      padding={"16px"}
      paddingRight={"0px"}
    >
      <Body dataResponse={dataResponse} loading={loading} />
      <hr style={{opacity: "40%", margin: "0px", color: "#4D4D4F", paddingRight: "16px"}} />
      <ChatInput
        fetchData={fetchData}
        inputText={inputText}
        setInputText={setInputText}
        setIsOpened={setIsOpened}
        loading={loading}
      />
    </Box>
  );
};
