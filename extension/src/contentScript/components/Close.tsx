import { Box } from "@chakra-ui/react";
import React from "react";

interface CloseProps {}

export const Close: React.FC<CloseProps> = ({}) => {
  return <div style={{display: "flex", justifyContent: "start", alignItems: "center", height: "40px", width: "30px", borderRadius: "10px 0px 0px 10px", backgroundColor: "#FFFFFF", paddingLeft: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"}}>
    <p style={{ fontFamily: "Arial", fontSize: "20px", color: "#5F6368"}}>{'<'}</p>
  </div>
};
