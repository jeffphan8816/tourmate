import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";

  

function Footer() {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  return (
    <Box marginTop='80px' padding='40px 0' bgcolor={neutralLight}>
      <Box
        width='80%'
        margin='0 auto'
        display='flex'
        justifyContent='space-between'
        flexWrap='wrap'
        rowGap='40px'
        columnGap='40px'
      >
        <Box width='clamp(20%, 30%, 40%)'>
          <Typography variant='h4' fontWeight='bold' mb='30px' color='#53e3ab'>
            TourMate
          </Typography>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat
          </div>
        </Box>

        <Box>
          <Typography variant='h4' fontWeight='bold' mb='30px'>
            About Us
          </Typography>
          <Typography mb='15px'>Careers</Typography>
          <Typography mb='15px'>Our Stores</Typography>
          <Typography mb='15px'>Terms & Conditions</Typography>
          <Typography mb='15px'>Privacy Policy</Typography>
        </Box>

        <Box>
          <Typography variant='h4' fontWeight='bold' mb='30px'>
            Customer Care
          </Typography>
          <Typography mb='15px'>Help Center</Typography>
          <Typography mb='15px'>Track Your Plan</Typography>
          <Typography mb='15px'>Corporate</Typography>
          <Typography mb='15px'>Returns & Refunds</Typography>
        </Box>

        <Box>
          <Typography variant='h4' fontWeight='bold' mb='30px'>
            Contact Us
          </Typography>
          <Typography mb='15px'>19 Highland Ave, Croydon, VIC 3136</Typography>
          <Typography mb='15px'>Email: jeffphan8816@gmail.com</Typography>
          <Typography mb='15px'>0450 600 496</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;