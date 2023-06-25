import React from "react";
import FlexBox from "../../../components/FlexBox";
import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  MenuItem,
  Palette,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Search,
  Message,
  LightMode,
  DarkMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./index.css";



declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}
//TODO: fix any props type
const Header = (props: any) => {
  const theme = useTheme();

  const neutralLight = theme.palette.neutral.light;
  const neutralDark = theme.palette.neutral.dark;
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const background = theme.palette.background.default;

  return (
    <FlexBox className='container'>
      <Box className='logo'>
        <Typography
          id='logoTypo'
          // onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              cursor: "pointer",
              // color: primaryLight,
            },
          }}
        >
          TourMate
        </Typography>
      </Box>
      <FlexBox className='nav' marginRight='40px' >
        <IconButton onClick={props.colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness4Icon sx={{ fontSize: "25px" }} />
          ) : (
            <Brightness7Icon sx={{ fontSize: "25px" }} />
          )}
        </IconButton>
        <IconButton color="inherit">
          <Notifications sx={{ fontSize: "25px", }} />
        </IconButton>
        <IconButton color="inherit">
          <ShoppingCartIcon sx={{ fontSize: "25px" }} />
        </IconButton>

        <FormControl variant='standard'>
          <Select
            value='firstname'
            sx={{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                pr: "0.25rem",
                width: "3rem",
              },
              "& .MuiSelect-select:focus": {
                backgroundColor: neutralLight,
              },
            }}
            input={<InputBase />}
          >
            <MenuItem value='firstname'>
              <Typography>firstname</Typography>
            </MenuItem>
            <MenuItem value='Logout'> Log Out </MenuItem>
          </Select>
        </FormControl>
      </FlexBox>
    </FlexBox>
  );
};

export default Header;
