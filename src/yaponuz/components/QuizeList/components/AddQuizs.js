import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Quiz } from "yaponuz/data/api";
import { Lesson } from "yaponuz/data/controllers/lesson";
import Card from "@mui/material/Card";
import { useNavigate } from 'react-router-dom'
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import Icon from "@mui/material/Icon";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "examples/Tables/DataTable";
import Tooltip from "@mui/material/Tooltip";
import SoftAlert from "components/SoftAlert";
import { FileController } from "yaponuz/data/api";


export default function AddQuiz() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [lessions, setLessons] = useState([])
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [selectedLession, setSelectedLession] = useState({status: false})
  const [modules, setModules] = useState([])
  const [newModule, setNewModule] = useState({
    creatorId: localStorage.getItem('userId')
  })
  const [formData, setFormData] = useState({
    createdBy: localStorage.getItem('userId'),
    quizType: false,
    option: [],
    question: false
  })

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const my = { margin: "5px 0px" };

  const getAllLessons = async () => {
    setLoading(true);
    try {
      const response = await Lesson.getAllLessons(page, size);
      setLessons(response.object.content);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

    React.useEffect(() => {
      getAllLessons();
    }, [page, size]);

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added", response.message, "success");
    } else {
      Swal.fire("error", response.message || response.error, "error");
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

        const response = await Quiz.createQuiz(formData);
        console.log(response)
        loadingSwal.close();
        showAlert(response);
        setFormData({
          createdBy: localStorage.getItem('userId'),
          quizType: false,
          option: [],
          question: false
        });
        navigate('/quizes')
        setOpen(false)
      } catch (err) {
        console.log("Error from handleSave from add Quiz: ", err);
      }
    };

    const newModuleHandler = (lession) => {
      setNewModule({...newModule, lessonId: lession.id})
      setOpen(true)
    }

  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "createdAt", accessor: "createdAt" },
    { Header: "name", accessor: "name" },
    { Header: "action", accessor: "action" },
  ];
  const rows = lessions.map((lession) => ({
    id: lession.id,
    createdAt:
      new Date(lession.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "") ?? "null",
    name: lession.name,
    action: (
      <SoftBox display="flex" alignItems="center" gap="10px">
        <SoftTypography
          variant="body1"
          color="secondary"
          sx={{ cursor: "pointer", lineHeight: 0 }}
        >
        <Tooltip title="Add module" placement="top">
          <SoftButton onClick={() => newModuleHandler(lession)}><AddIcon /> module</SoftButton>
        </Tooltip>
        </SoftTypography>

        <SoftTypography
          variant="body1"
          color="secondary"
          sx={{ cursor: "pointer", lineHeight: 0 }}
          >
            <Tooltip title="Add quiz" placement="top">
              <SoftButton onClick={() => getAllModule(lession)}><AddIcon /> quiz</SoftButton>
            </Tooltip>
          </SoftTypography>
        </SoftBox>
    ),
  }));
  const tabledata = { columns, rows };

  const getAllModule = async (lessionData) => {
    setLoading(true)
    setNewModule({...newModule, lessonId: lessionData.id})
    setSelectedLession({status: true, data: lessionData})
    try {
      const response = await Quiz.getAllModuleByLessonId(lessionData.id);
      const options = response.object.map((module) => ({
        label: module.name,
        value: module.id
      }));
      setModules(options);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false)
    }
  }

  const handleCenel = () => {
    setNewModule({...newModule, lessonId: false})
    setSelectedLession({ status: false })
    setModules([])
  }


  const addNewModule = async () => {
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
      const response = await Quiz.createQuizModule(newModule);
      setModules([{ label: response.object.name, value: response.object.id }]);
      loadingSwal.close();
      showAlert(response);
      setOpen(false);
    } catch(e){
      console.log('Error: '+e)
    }
  }

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function splitInputToArray(input, char) {
    if (!input) return [];
    const arr = input.split(char).map((item) => item.trim());
    setFormData({
      ...formData,
      correctOrder: arr,
      option: shuffleArray(arr)
    })
  }

  const getQUizOPtions = formData.option.map((item) => ({
    label: item,
    value: item,
  }));

  const handleChangeFlashCard = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      correctFlashCard: {
        ...prevFormData.correctFlashCard,
        [field]: value,
      },
    }));
  };


  const uploadHandle = async (file, category) => {
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

      const response = await FileController.uploadFile(
        file,
        category,
        localStorage.getItem("userId")
      );
      console.log("Yuklash natijasi:", response);

      loadingSwal.close();
      showAlert(response);
      setOpen(false);

      return response;
    } catch (err) {
      showAlert({ response: false, error: err.message });
      console.log("File Upload Error: ", err);
      return false;
    }
  };

  const handleFileChange = async (e, category, column) => {
    try{
      const selectedFile = e.target.files[0];
      const response = await uploadHandle(selectedFile, category)
      setFormData({...formData, [column]: response.object.id});
    }catch (e){
      console.log('Error: '+e)
    }
  }


  const renderQuizType = (quizType) => {
    if(quizType !== false){
      switch (quizType) {
        case "DRAG_AND_DROP":
          return (
            <SoftBox py={5}>
              <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>CorrectOrder</SoftTypography>
              <SoftInput
                placeholder="CorrectOrder"
                style={my}
                onChange={(e) => splitInputToArray(e.target.value, " ")}
              />

              <SoftTypography>Options</SoftTypography>
              <SoftInput
                placeholder="Options"
                disabled={true}
                style={my}
                value={formData.option ?? formData.option.join(", ")}
              />
            </SoftBox>
          );

        case "FILL_IN_THE_BLANKS":
          return (
            <SoftBox py={5}>
              <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>Options</SoftTypography>
              <SoftInput
                placeholder="Options"
                style={my}
                onChange={(e) => splitInputToArray(e.target.value, ",")}
              />

              <SoftTypography>Correct answer</SoftTypography>
              <SoftSelect
                options={getQUizOPtions}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
              />
            </SoftBox>
          );

        case "FLASHCARD":
          return (
            <SoftBox py={5}>

            <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>Uzb</SoftTypography>
              <SoftInput
                placeholder="Uzb"
                style={my}
                onChange={(e) => handleChangeFlashCard('uzb', e.target.value)}
              />

              <SoftTypography>japanKanji</SoftTypography>
              <SoftInput
                placeholder="japanKanji"
                style={my}
                onChange={(e) => handleChangeFlashCard('japanKanji', e.target.value)}
              />

              <SoftTypography>japanHiragana</SoftTypography>
              <SoftInput
                placeholder="japanHiragana"
                style={my}
                onChange={(e) => handleChangeFlashCard('japanHiragana', e.target.value)}
              />
            </SoftBox>
          );

        case "IMAGE_BASED":
          return (
            <SoftBox py={5}>
              <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>Options</SoftTypography>
              <SoftInput
                placeholder="Options"
                style={my}
                onChange={(e) => splitInputToArray(e.target.value, ",")}
              />

              <SoftTypography>Select img</SoftTypography>
              <SoftInput
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, 'quiz', 'imageId')
                }
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              />

              <SoftTypography>Correct answer</SoftTypography>
              <SoftSelect
                options={getQUizOPtions}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
              />
            </SoftBox>
          );

        case "LISTENING":
          return (
            <SoftBox py={5}>
              <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>Options</SoftTypography>
              <SoftInput
                placeholder="Options"
                style={my}
                onChange={(e) => splitInputToArray(e.target.value, ",")}
              />

              <SoftTypography>Select audio</SoftTypography>
              <SoftInput
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  handleFileChange(e, 'quiz', 'audioId')
                }
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              />

              <SoftTypography>Correct answer</SoftTypography>
              <SoftSelect
                options={getQUizOPtions}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
              />
            </SoftBox>
          );

        case "MULTIPLE_CHOICE":
          return (
            <SoftBox py={5}>
              <SoftTypography>Question</SoftTypography>
              <SoftInput
                placeholder="Question"
                style={my}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />

              <SoftTypography>Options</SoftTypography>
              <SoftInput
                placeholder="Options"
                style={my}
                onChange={(e) => splitInputToArray(e.target.value, ",")}
              />

              <SoftTypography>Correct answer</SoftTypography>
              <SoftSelect
                options={getQUizOPtions}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
              />
            </SoftBox>
          );

        default:
          return (
            <div>
              <h3>Unknown Quiz Type</h3>
              <p>The selected quiz type is not supported.</p>
            </div>
          );
      }
    }
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card style={{ margin: "10px 0px", minHeight: "700px" }}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {selectedLession.status ? `Add Quize in ${selectedLession.data.name}` : 'Add Quize'}
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <SoftButton onClick={() => navigate("/quizes")}>All quizes</SoftButton>
            </Stack>
          </SoftBox>
          <SoftBox p={3}>
            {loading ? (
              <div style={{ width: "100%", display: "flex", justifyContent: "center", height: "50vh" }}>
                <div>Loading data...</div>
              </div>
            ) : selectedLession.status ? (
              <>
                {modules.length === 0 ? (
                  <>
                    <SoftAlert color="warning">Ushbu darsga tegishli module topilmadi!</SoftAlert>
                    <Stack spacing={1} direction="row" marginY={2}>
                      <SoftButton variant="gradient" onClick={handleClickOpen}>+ Modul ulash</SoftButton>
                    </Stack>
                  </>
                ) : (
                  <>
                    <SoftTypography variant="caption">Select module</SoftTypography>
                    <SoftSelect
                      options={modules}
                      onChange={(e) => setFormData({ ...formData, quizModuleId: e.value })}
                    />
                    <SoftTypography variant="caption">Quiz type</SoftTypography>
                    <SoftSelect
                      options={[
                        { label: "DRAG AND DROP", value: "DRAG_AND_DROP" },
                        { label: "FILL IN THE BLANKS", value: "FILL_IN_THE_BLANKS" },
                        { label: "FLASHCARD", value: "FLASHCARD" },
                        { label: "IMAGE BASED", value: "IMAGE_BASED" },
                        { label: "LISTENING", value: "LISTENING" },
                        { label: "MULTIPLE CHOICE", value: "MULTIPLE_CHOICE" },
                      ]}
                      onChange={(e) => setFormData({ ...formData, quizType: e.value })}
                    />
                    {renderQuizType(formData.quizType)}

                    <SoftBox display="flex" gap="10px" marginTop="10px">
                      <SoftButton color="error" onClick={handleCenel}>
                        Cancel
                      </SoftButton>
                      <SoftButton color="success" onClick={handleSave}>
                        Save
                      </SoftButton>
                    </SoftBox>
                  </>
                )}
              </>
            ) : (
              <>
                <DataTable
                  table={tabledata}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 7, 10, 15, 20],
                  }}
                  canSearch
                />
              </>
            )}
          </SoftBox>
          <Dialog open={open} onClose={handleClose} size="xs" fullWidth>
            <DialogTitle>Add New Module</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SoftTypography variant="caption">Module name</SoftTypography>
                  <SoftInput
                    placeholder="Module name"
                    style={my}
                    onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                  />

                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={addNewModule}>Add Module</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );


}

// AddQuiz.propTypes = {
//   refetch: PropTypes.func,
// };