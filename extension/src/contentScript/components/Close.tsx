import { Box } from "@chakra-ui/react";
import React from "react";

interface CloseProps {}

export const Close: React.FC<CloseProps> = ({}) => {
  return <Box h={"48px"} w={"48px"} borderRadius={"50%"} bgColor={"lightgray"}></Box>;
};
