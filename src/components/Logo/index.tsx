import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../../src/assets/3-removebg-preview.png";

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        align-items: center;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoText = styled(Box)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(15)};
        font-weight: ${theme.typography.fontWeightBold};
        color: white;
`
);

function Logo() {
  return (
    <LogoWrapper to="/dashboard" className="flex flex-col items-center justify-center">
      <img src={logo} alt="Logo" style={{ width: "500px", height: "130px" }} />
      {/* <LogoText>Feel the culture</LogoText> */}
    </LogoWrapper>
  );
}

export default Logo;
