import { Box, Typography, Container, Grid, Link } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Logo from "../../../../assets/images/LogoWhite.png";

export default function Footer() {
    return (
        <footer>
            <Box sx={{ backgroundColor: "#1C1E2B", color: "white !important", py: 6 }}>
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={4}
                        alignItems="flex-start"
                        justifyContent="space-between"
                    >
                        <Grid item xs={12} md={3}>
                            <SoftBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                                />
                                <SoftTypography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ color: "white !important" }}
                                >
                                    Ustoz-X
                                </SoftTypography>
                            </SoftBox>
                        </Grid>

                        {/* Описание */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                EduPlatform
                            </Typography>
                            <Typography variant="body2">
                                Connecting students, parents, and teachers in one powerful platform for a better education experience.
                            </Typography>
                        </Grid>

                        {/* Быстрые ссылки */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Quick Links
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Link href="#" color="inherit" underline="hover">Home</Link>
                                <Link href="#" color="inherit" underline="hover">About</Link>
                                <Link href="#" color="inherit" underline="hover">FAQ</Link>
                                <Link href="#" color="inherit" underline="hover">Contact</Link>
                            </Box>
                        </Grid>

                        {/* Контакты */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Contact Us
                            </Typography>
                            <Typography variant="body2">Email: support@eduplatform.com</Typography>
                            <Typography variant="body2">Phone: +123 456 7890</Typography>
                            <Typography variant="body2">Address: 123 Education Street, Knowledge City</Typography>
                        </Grid>
                    </Grid>

                    <Box textAlign="center" mt={6} pt={2} borderTop="1px solid rgba(255,255,255,0.1)">
                        <Typography variant="body2" color="white">
                            © {new Date().getFullYear()} EduPlatform. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </footer>
    );
}
