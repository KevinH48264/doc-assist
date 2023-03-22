import { Box } from "@chakra-ui/react";
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
        bottom={!isOpened ? 0 : 100}
        right={0}
        margin={16}
        transition="all 0.5s ease"
      >
        {isOpened ? (
          <Box onClick={() => setIsOpened(false)}>
            <Open extractedText={extractedText}></Open>
          </Box>
        ) : (
          <Box
            onMouseOver={() => {
              if (!isOpened) setIsOpened(true);
            }}
            cursor={"pointer"}
          >
            <Close></Close>
          </Box>
        )}
      </Box>
    </React.StrictMode>
  );
};

export default GPTCard;
