import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function AboutUs() {
    const cards = [
        {
            title: "For Students",
            icon: <SchoolIcon fontSize="large" color="inherit" />,
            text: "Easy access to lessons, assignments, and progress tracking. Motivation through gamification and teacher feedback.",
        },
        {
            title: "For Parents",
            icon: <GroupsIcon fontSize="large" color="inherit" />,
            text: "Stay informed about your child's performance, homework, and communication with teachers. Simple navigation and full transparency.",
        },
        {
            title: "For Teachers",
            icon: <MenuBookIcon fontSize="large" color="inherit" />,
            text: "Tools for effective teaching, analytics for each student, and the ability to engage the whole class in learning.",
        },
    ];

    return (
        <Box component="section" sx={{ pt: "150px", pb: "100px", color: "#1C1E2B" }}>
            <Box maxWidth="1230px" mx="auto" px={2} textAlign="center">
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="body1" maxWidth="800px" mx="auto">
                    Our platform brings together students, parents, and teachers into a single educational space, building a strong and supportive community.
                </Typography>

                <Grid container spacing={4} mt={6}>
                    {cards.map((item, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <Paper
                                elevation={6}
                                sx={{
                                    p: 4,
                                    borderRadius: "20px",
                                    backgroundColor: "#2A2C3C",
                                    color: "white",
                                    textAlign: "center",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: 10,
                                        backgroundColor: "#32344a",
                                    },
                                }}
                            >
                                <Box mb={2} display="flex" justifyContent="center">
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2">{item.text}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box mt={6}>
                    <Button
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
                        Learn More
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
