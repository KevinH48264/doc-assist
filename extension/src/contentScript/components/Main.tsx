import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { extractText } from "../../utils";
import { Close } from "./Close";
import { Open } from "./Open";

interface GPTCardProps {
  pdfText: string;
}

const GPTCard: React.FC<GPTCardProps> = ({ pdfText }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  useEffect(() => {
    console.log("USING EFFECT!")
    if (pdfText) {
      setExtractedText(pdfText);
      return;
    }
    setExtractedText(extractText());
  }, []);

  return (
    <React.StrictMode>
      <Box
        zIndex={1000}
        position={"fixed"}
        bottom={!isOpened ? 0 : 50}
        right={0}
        margin={16}
        transition="all 0.5s ease"
        id="gptcard"
      >
        <Box>
          {isOpened ? (
            <Box marginBottom={"1em"}>
              <Open extractedText={extractedText}></Open>
            </Box>
          ) : null}
          <Flex
            justifyContent={"end"}
            onMouseOver={() => {
              console.log("mouse over");
              if (!isOpened) setIsOpened(true);
            }}
            onClick={() => {
              if (isOpened) setIsOpened(false);
            }}
          >
            <Close></Close>
          </Flex>
        </Box>
      </Box>
    </React.StrictMode>
  );
};

export default GPTCard;
