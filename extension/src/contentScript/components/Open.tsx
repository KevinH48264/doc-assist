import { Box } from "@chakra-ui/react";
import { createParser } from "eventsource-parser";
import React, { useState } from "react";
import { streamAsyncIterable } from "../../utils";
import { Body } from "./Body";
import { ChatInput } from "./ChatInput";

interface OpenProps {
  extractedText: string;
}

export const Open: React.FC<OpenProps> = ({ extractedText }) => {
  const [dataResponse, setDataResponse] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        website_text: extractedText,
        prompt: inputText,
        chat_history: [],
      }),
    };

    // TODO: Edit this URL
    fetch(
      `https://opendoc-conirvxfeq-uc.a.run.app/chat_stream`,
      options as any
    ).then(async (response) => {
      console.log("Calling OpenAI API");
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
        const event = new TextDecoder().decode(chunk);
        parser.feed(event);
      }
    });
    setLoading(false);
  };

  return (
    <Box
      borderRadius={"10px 0px 0px 10px"}
      bg={"black"}
      w={"300px"}
      border={"1px"}
      borderColor={"black"}
    >
      <Body dataResponse={dataResponse} loading={loading} />
      <hr style={{opacity: "40%", margin: "0px"}} />
      <ChatInput
        fetchData={fetchData}
        inputText={inputText}
        setInputText={setInputText}
      />
    </Box>
  );
};
