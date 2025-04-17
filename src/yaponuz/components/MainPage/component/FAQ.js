import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQ() {
    const faqData = [
        {
            question: "What is this platform about?",
            answer: "Our platform connects students, parents, and teachers in one unified educational environment to enhance collaboration and learning.",
        },
        {
            question: "Is this platform free to use?",
            answer: "Yes, basic features are available for free. Premium features may be available for educational institutions or individuals.",
        },
        {
            question: "How can parents monitor their child's progress?",
            answer: "Parents can view grades, assignments, teacher feedback, and more through the dedicated parent dashboard.",
        },
        {
            question: "Can teachers assign homework through the platform?",
            answer: "Absolutely. Teachers can assign, collect, and provide feedback on homework directly through their dashboard.",
        },
    ];

    return (
        <Box component="section" sx={{ pt: "120px", pb: "100px", backgroundColor: "#F7F7F7" }}>
            <Box maxWidth="900px" mx="auto" px={2}>
                <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4} color="#1C1E2B">
                    Frequently Asked Questions
                </Typography>

                {faqData.map((faq, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            mb: 2,
                            backgroundColor: "white",
                            borderRadius: "12px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                            "&:before": { display: "none" },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`faq-content-${index}`}
                            id={`faq-header-${index}`}
                        >
                            <Typography fontWeight={600}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
}
