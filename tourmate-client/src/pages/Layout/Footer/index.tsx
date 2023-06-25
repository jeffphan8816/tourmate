import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const footerContent = [
  {
    title: "TourMate",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    color: "#53e3ab",
  },
  {
    title: "About Us",
    links: ["Careers", "Our Stores", "Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "Customer Care",
    links: ["Help Center", "Track Your Order", "Corporate & Bulk Purchasing", "Returns & Refunds"],
  },
  {
    title: "Contact Us",
    address: "19 Highland Ave, Croydon, VIC 3136",
    email: "jeffphan8816@gmail.com",
    phone: "0450 600 496",
  },
];

function Footer() {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  return (
    <Box marginTop="80px" padding="40px 0" style={{ backgroundColor: neutralLight }}>
      <Box
        width="80%"
        margin="0 auto"
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap="40px"
        columnGap="40px"
      >
        {footerContent.map((section, index) => (
          <Box key={index} width="clamp(20%, 30%, 40%)">
            {section.title && (
              <Typography variant="h4" fontWeight="bold" mb="30px" color={section.color}>
                {section.title}
              </Typography>
            )}
            {section.description && <div>{section.description}</div>}
            {section.links && (
              <Box>
                {section.links.map((link, linkIndex) => (
                  <Typography key={linkIndex} mb="15px">
                    {link}
                  </Typography>
                ))}
              </Box>
            )}
            {section.address && <Typography mb="15px">{section.address}</Typography>}
            {section.email && <Typography mb="15px">Email: {section.email}</Typography>}
            {section.phone && <Typography mb="15px">Phone: {section.phone}</Typography>}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Footer;
