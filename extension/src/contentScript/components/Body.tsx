import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { formatResponse, getCurrentTab, getPdfText } from "../../utils";

interface BodyProps {
  dataResponse: any;
  loading: boolean;
}

export const Body: React.FC<BodyProps> = ({ dataResponse, loading }) => {
  return (
    <Box
      fontFamily={"Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"}
      fontSize={"16px"}
      marginBottom={"16px"}
      paddingRight={"16px"}
      height={window.innerHeight / 2}
      overflowY={"scroll"}
      color={"#D2D6DA"}
    >
      {!dataResponse
        ? ""
        : dataResponse}
    </Box>
  );
};
