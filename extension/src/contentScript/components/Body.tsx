import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getCurrentTab, getPdfText } from "../../utils";

interface BodyProps {
  dataResponse: any;
  loading: boolean;
}

export const Body: React.FC<BodyProps> = ({ dataResponse, loading }) => {

  return (
    <Box
      fontFamily={"monospace"}
      padding={"8px"}
      height={"340px"}
      overflow={"scroll"}
      color={"white"}
    >
      {loading
        ? "Generating..."
        : !dataResponse
        ? "Ask me a question!"
        : dataResponse}
    </Box>
  );
};
