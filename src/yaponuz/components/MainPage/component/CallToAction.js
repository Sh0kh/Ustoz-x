import { Box, Button, Typography, Container } from "@mui/material";

export default function CallToAction() {
    return (
        <section style={{ backgroundColor: "#1C1E2B", padding: "60px 0" }}>
            <Container maxWidth="md">
                <Typography variant="h4" color="white !important" fontWeight="bold" textAlign="center" mb={3}>
                    Ready to get started?
                </Typography>
                <Typography variant="body1" color="white !important" textAlign="center" mb={4}>
                    Join us today and unlock the best educational experience for your child. Lets build a brighter future together.
                </Typography>
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "white !important",
                            color: "#1C1E2B !important",
                            "&:hover": { backgroundColor: "#D78E17" },
                            padding: "12px 30px",
                        }}
                    >
                        Get Started
                    </Button>
                </Box>
            </Container>
        </section>
    );
}
