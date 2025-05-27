import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Rating,
    Typography,
    Pagination,
    Button,
    Stack,
    IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Reting } from "yaponuz/data/controllers/rating";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import RatingDelete from "./RatingDelete";
import EditRating from "./EditRating";

export default function CourseRating() {
    const { ID } = useParams();
    const [loadingRating, setLoadingRating] = useState(true);
    const [page, setPage] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const getRating = async () => {
        setLoadingRating(true);
        try {
            const data = {
                id: ID,
                page: page,
                size: 10,
            };
            const response = await Reting.getAllRating(data);
            setRatings(response.object.content);
            setTotalPages(response.object.totalPages);
        } catch (err) {
            console.log("Error from courses list GET: ", err);
        } finally {
            setLoadingRating(false);
        }
    };

    useEffect(() => {
        getRating();
    }, [ID, page]);

    const handlePageChange = (_, value) => {
        setPage(value - 1);
    };


    return (
        <>
            {loadingRating ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box px={2} py={3}>
                    {ratings.length === 0 ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="300px"
                            textAlign="center"
                        >
                            <Typography variant="h5" mt={2}>
                                No ratings available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Once someone leaves a rating, it will appear here.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {ratings.map((item) => (
                                <Card key={item.id} sx={{ mb: 3, width: "100%" }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {item.user?.firstName} {item.user?.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.user?.phoneNumber}
                                        </Typography>

                                        <Typography variant="h6" gutterBottom mt={2}>
                                            Comment:
                                        </Typography>
                                        <Typography variant="body1" mb={2}>
                                            {item.comment}
                                        </Typography>

                                        <Rating value={item.rating} readOnly />
                                        <Typography variant="caption" display="block" mt={1} mb={2}>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </Typography>

                                        <Stack direction="row" spacing={1}>
                                            <EditRating item={item} refresh={getRating} />
                                            <RatingDelete id={item?.id} refresh={getRating} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}

                            <Box display="flex" justifyContent="center" mt={4}>
                                <Pagination
                                    count={totalPages}
                                    page={page + 1}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </>
    );
}
