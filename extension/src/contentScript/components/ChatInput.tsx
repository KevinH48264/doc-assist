import { Box, Input } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface InputProps {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  inputText: string;
  fetchData: any;
}

export const ChatInput: React.FC<InputProps> = ({
  setInputText,
  inputText,
  fetchData,
}) => {
  const autoFocus = useCallback((el) => (el ? el.focus() : null), []);

  const returnHandler = async (e: any) => {
    if (e.keyCode === 13 && inputText) {
      fetchData();
    }
  };

  return (
    <Box>
      <Input
        ref={autoFocus}
        padding={"16px"}
        borderTopRadius={"16px"}
        // width={"100%"}
        width={"500px"}
        type="text"
        placeholder="AMA about this page"
        border={0}
        background={"black"}
        outline={0}
        color={"grey"}
        fontFamily={"monospace"}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={returnHandler}
      />
    </Box>
  );
};
