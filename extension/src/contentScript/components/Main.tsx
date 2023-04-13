import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { extractText } from "../../utils";
import { Close } from "./Close";
import { Open } from "./Open";
import { Readability } from "@mozilla/readability";

interface GPTCardProps {
  pdfText: string;
}

const GPTCard: React.FC<GPTCardProps> = ({ pdfText }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    var documentClone = document.cloneNode(true);
    var article = new Readability(documentClone as Document).parse();
    if (pdfText) {
      setExtractedText(pdfText);
      return;
    }

    console.log(article?.textContent);
    // console.log(article);
    if (article?.textContent) setExtractedText(article?.textContent);
  }, []);

  return (
    <React.StrictMode>
      <Box
        zIndex={1000}
        position={"fixed"}
        bottom={!isOpened ? 0 : 100}
        right={0}
        margin={16}
        transition="all 0.5s ease"
      >
        <Box>
          {isOpened ? (
            <Box marginBottom={"1em"}>
              <Open extractedText={extractedText}></Open>
            </Box>
          ) : null}
          <Flex
            justifyContent={"end"}
            // onMouseOver={() => {
            //   console.log("mouse over");
            //   if (!isOpened) setIsOpened(true);
            // }}
            onClick={() => {
              if (isOpened) setIsOpened(false);
              if (!isOpened) setIsOpened(true);
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
