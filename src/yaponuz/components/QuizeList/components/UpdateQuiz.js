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
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import SoftSelect from "components/SoftSelect";
import { Module } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import form from "layouts/pages/users/new-user/schemas/form";
import { FileController } from "yaponuz/data/api";

export default function UpdateQuiz({ handleCenel, item, set }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(item);


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const my = { margin: "5px 0px" };

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

  const getQUizOPtions = formData?.option?.map((item) => ({
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
      if (response.success) {
        Swal.fire("Updated", response.message, "success");
      } else {
        Swal.fire("error", response.message || response.error, "error");
      }
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

  const cardRender = () => {
    switch (formData.quizType) {
      case "DRAG_AND_DROP":
        const value = formData.correctOrder.join(" ");
        const option = formData.option.join(" ");
        return (
          <SoftBox py={5}>
            <SoftTypography>Question</SoftTypography>
            <SoftInput
              placeholder="Question"
              style={my}
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>CorrectOrder</SoftTypography>
            <SoftInput
              placeholder="CorrectOrder"
              style={my}
              value={value}
              onChange={(e) => splitInputToArray(e.target.value, " ")}
            />

            <SoftTypography>Options</SoftTypography>
            <SoftInput
              placeholder="Options"
              disabled={true}
              style={my}
              value={option}
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
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>Options</SoftTypography>
            <SoftInput
              placeholder="Options"
              style={my}
              value={formData.correctOrder ?? formData.correctOrder.join(", ")}
              onChange={(e) => splitInputToArray(e.target.value, ",")}
            />

            <SoftTypography>Correct answer</SoftTypography>
            <SoftSelect
              options={getQUizOPtions}
              defaultValue={{label: formData.correctAnswer, value: formData.correctAnswer}}
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
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>Uzb</SoftTypography>
            <SoftInput
              placeholder="Uzb"
              style={my}
              value={formData.correctFlashCard.uzb}
              onChange={(e) => handleChangeFlashCard('uzb', e.target.value)}
            />

            <SoftTypography>japanKanji</SoftTypography>
            <SoftInput
              placeholder="japanKanji"
              style={my}
              value={formData.correctFlashCard.japanKanji}
              onChange={(e) => handleChangeFlashCard('japanKanji', e.target.value)}
            />

            <SoftTypography>japanHiragana</SoftTypography>
            <SoftInput
              placeholder="japanHiragana"
              style={my}
              value={formData.correctFlashCard.japanHiragana}
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
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>Options</SoftTypography>
            <SoftInput
              placeholder="Options"
              style={my}
              value={formData.correctOrder ?? formData.correctOrder.join(",")}
              onChange={(e) => splitInputToArray(e.target.value, ",")}
            />

            <SoftTypography>Correct answer</SoftTypography>
            <SoftSelect
              defaultValue={{label: formData.correctAnswer, value: formData.correctAnswer}}
              options={getQUizOPtions}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
            />

            <SoftTypography>Select img {formData.imageId}</SoftTypography>
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
                marginBottom: '100px'
              }}
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
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>Options</SoftTypography>
            <SoftInput
              placeholder="Options"
              style={my}
              value={formData.option ?? formData.option.join(", ")}
              onChange={(e) => setFormData({
                ...formData,
                option: e.target.value.split(',').map((item) => item.trim())
              })}
            />

            <SoftTypography>Correct answer</SoftTypography>
            <SoftSelect
              defaultValue={{label: formData.correctAnswer, value: formData.correctAnswer}}
              options={getQUizOPtions}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.value })}
            />

            <SoftTypography>Select audio {formData.audioId}</SoftTypography>
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
                marginBottom: '100px'
              }}
            />
          </SoftBox>
        );

      case "MULTIPLE_CHOICE":
        return (
          <SoftBox py={5} style={{height: '400px'}}>
            <SoftTypography>Question</SoftTypography>
            <SoftInput
              placeholder="Question"
              style={my}
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />

            <SoftTypography>Options</SoftTypography>
            <SoftInput
              placeholder="Options"
              style={my}
              value={formData.correctOrder ?? formData.correctOrder.join(", ")}
              onChange={(e) => splitInputToArray(e.target.value, ",")}
            />

            <SoftTypography>Correct answer</SoftTypography>
            <SoftSelect
              defaultValue={{label: formData.correctAnswer, value: formData.correctAnswer}}
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
  return (
    <>
      <SoftBox p={3}>
        {cardRender(item)}
        <SoftBox display="flex" gap="10px" marginTop="10px">
          <SoftButton color="error" onClick={() => handleCenel('index')}>
            Cancel
          </SoftButton>
          <SoftButton color="success" onClick={() => set(formData)}>
            Save
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </>
  );
}

UpdateQuiz.propTypes = {
  handleCenel: PropTypes.func.isRequired,
  item: PropTypes.object,
  set: PropTypes.func,
};