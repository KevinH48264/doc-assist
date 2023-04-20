import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
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
  const wrapperRef = useRef(null);

  // only store dataResponse once
  const [dataResponse, setDataResponse] = useState("");

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpened(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    var documentClone = document.cloneNode(true);
    var article = new Readability(documentClone as Document).parse();
    if (pdfText) {
      setExtractedText(pdfText);
      return;
    }

    if (article?.textContent) setExtractedText(article?.textContent);
  }, []);

  return (
    <Box
      ref={wrapperRef}
      zIndex={1000}
      position={"fixed"}
      bottom={0}
      right={0}
      marginBottom={10}
      transition="all 0.5s ease"
      id="gptcard"
    >
      <Box>
        {isOpened ? (
          <Box>
            <Open
              extractedText={extractedText}
              setIsOpened={setIsOpened}
              dataResponse={dataResponse}
              setDataResponse={setDataResponse}
            />
          </Box>
        ) : (
          <Flex
            justifyContent="flex-end"
            className="transition-all"
            onMouseOver={() => {
              if (!isOpened) {
                setIsOpened(true);
              }
            }}
          >
            <Close />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default GPTCard;
