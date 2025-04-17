import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from "@mui/material";

export default function Testimonials() {
    return (
        <section style={{ padding: "60px 0", backgroundColor: "#F7F7F7" }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
                    What People Say
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {/* First Testimonial Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                                },
                                borderRadius: "10px",
                                padding: "20px",
                            }}
                        >
                            <CardContent>
                                <Box textAlign="center">
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            margin: "0 auto",
                                            border: "2px solid #1C1E2B",
                                        }}
                                        src="/team-member1.jpg"
                                    />
                                    <Typography variant="h6" fontWeight="bold" mt={2}>
                                        John Doe
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Student
                                    </Typography>
                                    <Typography variant="body2" mt={2}>
                                        This platform made learning so much easier and more engaging. The interactive lessons kept me motivated!
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Second Testimonial Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                                },
                                borderRadius: "10px",
                                padding: "20px",
                            }}
                        >
                            <CardContent>
                                <Box textAlign="center">
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            margin: "0 auto",
                                            border: "2px solid #1C1E2B",
                                        }}
                                        src="/team-member2.jpg"
                                    />
                                    <Typography variant="h6" fontWeight="bold" mt={2}>
                                        Jane Smith
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Teacher
                                    </Typography>
                                    <Typography variant="body2" mt={2}>
                                        As a teacher, I can see the progress my students make in real-time. Its a game-changer for my teaching!
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Third Testimonial Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                                },
                                borderRadius: "10px",
                                padding: "20px",
                            }}
                        >
                            <CardContent>
                                <Box textAlign="center">
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            margin: "0 auto",
                                            border: "2px solid #1C1E2B",
                                        }}
                                        src="/team-member3.jpg"
                                    />
                                    <Typography variant="h6" fontWeight="bold" mt={2}>
                                        Alice Brown
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Parent
                                    </Typography>
                                    <Typography variant="body2" mt={2}>
                                        My child is enjoying learning through the platform, and I can track their progress in real-time. Highly 
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}
