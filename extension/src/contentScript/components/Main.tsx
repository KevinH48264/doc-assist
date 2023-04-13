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
  console.log("RELOADING PAGE")
  const [isOpened, setIsOpened] = useState(false);
  const [isOverCard, setIsOverCard] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // only store dataResponse once
  const [dataResponse, setDataResponse] = useState("");

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

    // add a listener to document if what was clicked was not gptcard
    document.addEventListener('click', function(event) {
      console.log("isOverCard click", "isOverCard", isOverCard, "isOpened", isOpened)
      if (!isOverCard && isOpened) {
        setIsOpened(false);
      } 
      // else if (!isOpened) {
      //   setIsOpened(true);
      // }
    });
  }, []);

  return (
    // <React.StrictMode>
      <Box
        zIndex={1000}
        position={"fixed"}
        bottom={0}
        // bottom={!isOpened ? 0 : 0}
        right={0}
        marginBottom={10}
        // transition="all 0.5s ease"
        id="gptcard"
        onMouseLeave={() => {
          setIsOverCard(false);
          console.log("isOverCard leave", isOverCard)
        }}
      >
        <Box>
          {isOpened ? (
            <Box>
              <Open extractedText={extractedText} setIsOpened={setIsOpened} dataResponse={dataResponse} setDataResponse={setDataResponse}/>
            </Box>
          ) : (
            <Flex
              justifyContent="flex-end"
              className="transition-all"
              onMouseOver={() => {
                console.log("mouse over");
                console.log("isOverCard MOUSE OVER BEFORE", "isOverCard", isOverCard, "isOpened", isOpened)
                if (!isOpened || !isOverCard) {
                  setIsOpened(true);
                  setIsOverCard(true);
                }
                console.log("isOverCard MOUSE OVER", "isOverCard", isOverCard, "isOpened", isOpened)
              }}
            >
              <Close />
            </Flex>
          )}
        </Box>
      </Box>
    // </React.StrictMode>
  );
};

export default GPTCard;
