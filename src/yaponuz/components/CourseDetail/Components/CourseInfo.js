import { Box, Typography, Divider, Grid, Chip, CircularProgress } from "@mui/material";
import SoftBadge from "components/SoftBadge";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "yaponuz/data/controllers/course";

export default function CourseInfo() {

    const { ID } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    const getOneCourse = async () => {
        setLoading(true);
        try {
            const response = await Course.getOneCourse(ID);
            setData(response.object);
        } catch (err) {
            console.log("Error from courses list GET: ", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getOneCourse();
    }, [ID]);

    const theFalse = (
        <SoftBadge variant="contained" color="error" size="xs" badgeContent="false" container />
    );
    const theTrue = (
        <SoftBadge variant="contained" color="success" size="xs" badgeContent="true" container />
    );

    const renderHtml = (html) => (
        <Box
            dangerouslySetInnerHTML={{ __html: html }}
            sx={{ fontSize: "0.95rem", lineHeight: 1.6, mb: 2 }}
        />
    );

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                        Course Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Name:
                            </Typography>
                            <Typography>{data?.name || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Teacher:
                            </Typography>
                            <Typography>{data?.teacherName || "—"}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Description:
                            </Typography>
                            {data?.description ? renderHtml(data.description) : "—"}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Active:
                            </Typography>
                            {data?.active ? theTrue : theFalse}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Hidden:
                            </Typography>
                            {data?.hidden ? theTrue : theFalse}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Blocked:
                            </Typography>
                            {data?.block ? theTrue : theFalse}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Popular:
                            </Typography>
                            {data?.isPopular ? theTrue : theFalse}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Discounted:
                            </Typography>
                            {data?.isDiscounted ? (
                                <Chip label={data?.discounted || "✓"} color="primary" size="small" />
                            ) : (
                                theFalse
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Score:
                            </Typography>
                            <Typography>{data?.score ?? "—"}</Typography>
                        </Grid>
                    </Grid>
                </Box>)}

        </>
    );
}
