import { Box, Typography, Button } from "@mui/material";
import SoftInput from "components/SoftInput";

export default function Contact() {
    return (
        <Box component="section" sx={{ pt: "120px", pb: "100px", }}>
            <Box maxWidth="700px" mx="auto" px={2}>


                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#1C1E2B">
                        Contact Us
                    </Typography>
                    <SoftInput
                        placeholder="Your Name"
                        fullWidth
                        required
                        sx={{
                            "& input": {
                                padding: "14px",
                                fontSize: "16px",
                            },
                        }}
                    />
                    <SoftInput
                        placeholder="Phone Number"
                        fullWidth
                        required
                        sx={{
                            "& input": {
                                padding: "14px",
                                fontSize: "16px",
                            },
                        }}
                    />
                    <SoftInput
                        placeholder="Your Message"
                        multiline
                        rows={5}
                        fullWidth
                        required
                        sx={{
                            "& textarea": {
                                padding: "14px",
                                fontSize: "16px",
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#1C1E2B",
                            color: "white !important",
                            fontWeight: "bold",
                            px: 4,
                            py: 1.5,
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "white !important",
                                color: "#1C1E2B !important",
                                border: "1px solid white",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        Send Message
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
