import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FileController } from "yaponuz/data/api";
import { useParams } from "react-router-dom";
import { report } from "yaponuz/data/api";
import { Course } from "yaponuz/data/controllers/course";
// Import missing controllers
import { Module } from "yaponuz/data/controllers/module";
import { Lesson } from "yaponuz/data/controllers/lesson";
import SoftDatePicker from "components/SoftDatePicker";
import { personality } from "yaponuz/data/controllers/personality";

export default function AddPersonality({ refetch }) {
    const { ID } = useParams();
    const [open, setOpen] = useState(false);
    const [score, setScore] = useState('');
    const [fileId, setFileId] = useState(null);
    const [info, setInfo] = useState('');
    const [selectType, setSelectType] = useState('');
    const [error, setError] = useState('');
    const [date, setDate] = useState('')

    // Course selection states
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Module selection states
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);

    // Lesson selection states
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Pagination params for API calls
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);
    const [lessonID, setLessonID] = useState(null);



    // Load courses when component mounts
    useEffect(() => {
        if (open) {
            getAllCourses(page, size);
        }
    }, [open]);

    // Load modules when course is selected
    useEffect(() => {
        if (selectedCourse) {
            getModules(selectedCourse);
            // Reset dependent selections
            setSelectedModule(null);
            setSelectedLesson(null);
            setModules([]);
            setLessons([]);
        }
    }, [selectedCourse]);

    // Load lessons when module is selected
    useEffect(() => {
        if (selectedModule) {
            getModuleLessons(selectedModule);
            // Reset lesson selection
            setSelectedLesson(null);
            setLessons([]);
        }
    }, [selectedModule]);

    const showAlert = (response) => {
        function reload() {
            refetch();
        }
        if (response.success) {
            Swal.fire("Added", response.message, "success").then(() => reload());
        } else {
            Swal.fire("error", response.message || response.error, "error").then(() => reload());
        }
    };

    const handleSave = async () => {
        try {
            const loadingSwal = Swal.fire({
                title: "Adding...",
                text: "Please Wait!",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Format the date properly - convert from array to string if needed
            let formattedDate = date;
            if (Array.isArray(date)) {
                formattedDate = date[0]; // Take the first element from the array
            }

            const data = {
                studentId: Number(ID),
                info,
                date: formattedDate, // Use the properly formatted date
                score: Number(score),
                lessonId: selectedLesson?.value
            };

            const response = await personality?.createPersonality(data);
            loadingSwal.close();

            showAlert(response);

            // clear the data
            resetForm();

            // close the modal
            setOpen(false);
        } catch (err) {
            console.error("Error saving report:", err);
            Swal.fire("Error", "Failed to save report. Please try again.", "error");
        }
    };
    const resetForm = () => {
        setScore('');
        setInfo('');
        setSelectType('');
        setSelectedCourse(null);
        setSelectedModule(null);
        setSelectedLesson(null);
    };

    const getAllCourses = async (page, size) => {
        try {
            const response = await Course.getAllCourses(page, size);

            const formattedCourses = response.object?.map(course => ({
                value: course.id,
                label: course.name || course.title
            })) || [];

            setCourses(formattedCourses);
        } catch (err) {
            console.error("Error from courses list GET: ", err);
            setError("Failed to fetch courses. Please try again later.");
        }
    };

    const getModules = async (courseId) => {
        try {
            const response = await Module.getModuleById(courseId.value);

            // Transform data to match SoftSelect format
            const formattedModules = response.object?.map(module => ({
                value: module.id,
                label: module.name || module.title
            })) || [];

            setModules(formattedModules);
        } catch (err) {
            console.error("Error from module list GET: ", err);
            setError("Failed to fetch modules. Please try again later.");
        }
    };

    const getModuleLessons = async (moduleId) => {
        try {
            const response = await Lesson.getAllLessons(page, size, moduleId.value);

            // Transform data to match SoftSelect format
            const formattedLessons = (response.object?.content || []).map(lesson => ({
                value: lesson.id,
                label: lesson.name || lesson.title
            }));

            setLessons(formattedLessons);
            setLessonID(moduleId);
        } catch (err) {
            console.error("Error from lesson list GET:", err);
            setError("Failed to fetch lessons. Please try again later.");
        }
    };

    const my = { margin: "5px 0px" };

    return (
        <>
            <SoftButton onClick={() => setOpen(true)} variant="gradient" color='dark'>
                + add new personality
            </SoftButton>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '70%',
                        height: '80vh',
                        maxHeight: '90vh',
                    },
                }}>
                <DialogTitle>
                    Add new personality
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {/* Sequential selection: Course -> Module -> Lesson */}
                            <SoftBox style={my}>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Course
                                </SoftTypography>
                                <SoftSelect
                                    placeholder="Select a course"
                                    options={courses}
                                    value={selectedCourse}
                                    onChange={(value) => setSelectedCourse(value)}
                                />
                            </SoftBox>

                            {selectedCourse && (
                                <SoftBox style={my}>
                                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                                        Module
                                    </SoftTypography>
                                    <SoftSelect
                                        placeholder="Select a module"
                                        options={modules}
                                        value={selectedModule}
                                        onChange={(value) => setSelectedModule(value)}
                                        isDisabled={!selectedCourse}
                                    />
                                </SoftBox>
                            )}

                            {selectedModule && (
                                <SoftBox style={my}>
                                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                                        Lesson
                                    </SoftTypography>
                                    <SoftSelect
                                        placeholder="Select a lesson"
                                        options={lessons}
                                        value={selectedLesson}
                                        onChange={(value) => setSelectedLesson(value)}
                                        isDisabled={!selectedModule}
                                    />
                                </SoftBox>
                            )}

                            <Grid item xs={12}>
                                <SoftTypography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                    Date
                                </SoftTypography>
                                <SoftDatePicker
                                    placeholder="Date of Birth"
                                    value={date}
                                    fullWidth
                                    onChange={(newDate) => setDate(newDate)}
                                />
                            </Grid>
                            <SoftBox width='100%'>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Score
                                </SoftTypography>
                                <SoftInput
                                    placeholder="Score"
                                    value={score}
                                    style={my}
                                    type='number'
                                    onChange={(e) => setScore(e.target.value)}
                                />
                            </SoftBox>

                            <SoftBox style={my}>
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                    Info
                                </SoftTypography>
                                <SoftInput
                                    multiline
                                    rows={4}
                                    placeholder="Enter additional information"
                                    value={info}
                                    style={my}
                                    onChange={(e) => setInfo(e.target.value)}
                                />
                            </SoftBox>

                            {error && (
                                <SoftBox style={my}>
                                    <SoftTypography color="error" fontSize="0.75rem">
                                        {error}
                                    </SoftTypography>
                                </SoftBox>
                            )}

                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!selectedLesson || !score || !date}
                                >
                                    Add report
                                </Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

AddPersonality.propTypes = {
    refetch: PropTypes.func.isRequired,
};