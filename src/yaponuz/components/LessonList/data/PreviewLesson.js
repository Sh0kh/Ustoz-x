import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Tag as TagIcon,
  Layers as LayersIcon,
  YouTube as YouTubeIcon,
  VideoLibrary as VideoLibraryIcon,
  CloudQueue as CloudQueueIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Eye } from "lucide-react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PreviewLesson = ({ value }) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const renderValue = (field, val) => {
    if (val === null || val === undefined || val === "") {
      return (
        <Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic" }}>
          Empty field
        </Typography>
      );
    }
    if (typeof val === "boolean") {
      return (
        <Typography
          variant="body2"
          color={val ? "success" : "error"}
          style={{ fontWeight: "bold" }}
        >
          {val.toString()}
        </Typography>
      );
    }
    if (field === "createdAt") {
      return <Typography variant="body2">{formatDate(val)}</Typography>;
    }
    return <Typography variant="body2">{val.toString()}</Typography>;
  };

  const fields = [
    { name: "id", icon: <TagIcon />, label: "ID" },
    { name: "createdAt", icon: <CalendarTodayIcon />, label: "Created At" },
    { name: "createdBy", icon: <PersonIcon />, label: "Created By" },
    { name: "moduleId", icon: <LayersIcon />, label: "Module ID" },
    { name: "lessonMinute", icon: <AccessTimeIcon />, label: "Duration (minutes)" },
    { name: "youTubeLink", icon: <YouTubeIcon />, label: "YouTube Link" },
    { name: "vimeoLink", icon: <VideoLibraryIcon />, label: "Vimeo Link" },
    { name: "googleDrive", icon: <CloudQueueIcon />, label: "Google Drive" },
    { name: "jeLearning", icon: <SchoolIcon />, label: "JE Learning" },
    { name: "sort", icon: <TagIcon />, label: "Sort Order" },
  ];

  return (
    <>
      <Tooltip title="Preview" placement="top">
        <Eye className="size-5 hover:opacity-50 cursor-pointer" onClick={handleClickOpen} />
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" style={{ fontWeight: "bold" }}>
            {value.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Overview" />
            <Tab label="Details" />
            <Tab label="Content" />
          </Tabs>
          <Box mt={2}>
            {tabValue === 0 && (
              <Card>
                <CardHeader title="Lesson Overview" subheader="Quick summary of the lesson" />
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTimeIcon color="action" />
                    <Typography variant="h6" style={{ marginLeft: 8 }}>
                      {value.lessonMinute} minutes
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Created By
                      </Typography>
                      <Typography variant="body1">{value.createdBy}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Created At
                      </Typography>
                      <Typography variant="body1">{formatDate(value.createdAt)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            {tabValue === 1 && (
              <Card>
                <CardHeader
                  title="Lesson Details"
                  subheader="Detailed information about the lesson"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {fields.map((field) => (
                      <Grid item xs={6} key={field.name}>
                        <Box display="flex" alignItems="center" mb={1}>
                          {React.cloneElement(field.icon, {
                            color: "action",
                            style: { marginRight: 8 },
                          })}
                          <Typography variant="subtitle2" color="textSecondary">
                            {field.label}
                          </Typography>
                        </Box>
                        {renderValue(field.name, value[field.name])}
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
            {tabValue === 2 && (
              <Card>
                <CardHeader title="Lesson Content" subheader="Detailed description and resources" />
                <CardContent>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Lesson Description</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div dangerouslySetInnerHTML={{ __html: value.about }} />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Lesson Resources</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {value.youTubeLink && (
                          <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                              <YouTubeIcon color="error" style={{ marginRight: 8 }} />
                              <a href={value.youTubeLink} target="_blank" rel="noopener noreferrer">
                                YouTube Video
                              </a>
                            </Box>
                          </Grid>
                        )}
                        {value.vimeoLink && (
                          <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                              <VideoLibraryIcon color="primary" style={{ marginRight: 8 }} />
                              <a href={value.vimeoLink} target="_blank" rel="noopener noreferrer">
                                Vimeo Video
                              </a>
                            </Box>
                          </Grid>
                        )}
                        {value.googleDrive && (
                          <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                              <CloudQueueIcon color="action" style={{ marginRight: 8 }} />
                              <a href={value.googleDrive} target="_blank" rel="noopener noreferrer">
                                Google Drive Resource
                              </a>
                            </Box>
                          </Grid>
                        )}
                        {value.jeLearning && (
                          <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                              <SchoolIcon color="secondary" style={{ marginRight: 8 }} />
                              <a href={value.jeLearning} target="_blank" rel="noopener noreferrer">
                                JE Learning Resource
                              </a>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

PreviewLesson.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.number,
    createdAt: PropTypes.string,
    createdBy: PropTypes.string,
    deleted: PropTypes.bool,
    moduleId: PropTypes.number,
    name: PropTypes.string.isRequired,
    lessonMinute: PropTypes.number.isRequired,
    about: PropTypes.string.isRequired,
    youTubeLink: PropTypes.string,
    isYouTubeLink: PropTypes.bool,
    vimeoLink: PropTypes.string,
    isVimeoLink: PropTypes.bool,
    googleDrive: PropTypes.string,
    isGoogleDrive: PropTypes.bool,
    jeLearning: PropTypes.string,
    isJeLearning: PropTypes.bool,
    sort: PropTypes.number,
  }).isRequired,
};

export default PreviewLesson;
