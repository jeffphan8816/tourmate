import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexBox = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}) as typeof Box;

export default FlexBox;