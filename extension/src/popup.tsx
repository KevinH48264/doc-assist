import { Box, Button } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";

interface PopupProps {}

const openFeedback = () => {
  chrome.tabs.create({ url: "https://forms.gle/BGCkPevq2eRumUD67" });
};

const Popup: React.FC<PopupProps> = ({}) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: ".375rem",
      }}
      bg={"#343540"}
    >
      <h3
        style={{
          width: "500px",
          color: "white",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        GPTCheck
      </h3>
      <p
        style={{
          margin: "10px",
          width: "90%",
          color: "white",
          display: "inline",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        GPTCheck searches through Google with your highlighted sentence. Then,
        it takes the top website results and finds the sentences that are most
        similar. The similarity score uses the cosine similarity score, which
        measures how much the general gist of two sentences are similar, so
        higher = better. It measures this by using an open-source machine
        learning language model to turn sentences into numbers and then
        calculates the correlation between the two numbers.
      </p>
      <p
        style={{
          margin: "10px",
          width: "90%",
          color: "white",
          display: "inline",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        We are currently in beta, so please feel free to share any feedback or
        requests you may have at{" "}
        <a
          style={{ color: "lightblue" }}
          onClick={() => {
            openFeedback();
          }}
          href="https://forms.gle/BGCkPevq2eRumUD67"
        >
          https://forms.gle/BGCkPevq2eRumUD67
        </a>
        . Your input will help us improve the extension and provide you with an
        even better experience.
      </p>
      <p
        style={{
          margin: "10px",
          width: "90%",
          color: "white",
          display: "inline",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Thanks for trying out our extension!
      </p>
    </Box>
  );
};

export default Popup;

ReactDOM.render(
  <React.StrictMode>
    <Popup></Popup>
  </React.StrictMode>,
  document.getElementById("root")
);
