import { Box, Input } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface InputProps {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  inputText: string;
  fetchData: any;
  setIsOpened: any;
}

export const ChatInput: React.FC<InputProps> = ({
  setInputText,
  inputText,
  fetchData,
  setIsOpened,
}) => {
  const autoFocus = useCallback((el) => (el ? el.focus() : null), []);

  const returnHandler = async (e: any) => {
    if (e.keyCode === 13 && inputText) {
      fetchData();
    }
  };

  return (
    <Box display={"flex"} marginTop={"16px"} alignContent={"space-between"}>
      <p style={{ fontFamily: "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: "20px", paddingRight: "16px", color: "white", fontWeight: "bold", cursor: "pointer", margin: "0px"}} onClick={() => setIsOpened(false)}>{'>'}</p>
      <Input
        ref={autoFocus}
        bg={'transparent'}
        paddingRight={"20px"}
        borderBottomRadius={"16px"}
        width={"100%"}
        type="text"
        placeholder="AMA about this page"
        border={0}
        background={"#202123"}
        outline={0}
        color={"white"}
        fontFamily={"Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"}
        fontSize={"16px"}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={returnHandler}
      />
    </Box>
  );
};
