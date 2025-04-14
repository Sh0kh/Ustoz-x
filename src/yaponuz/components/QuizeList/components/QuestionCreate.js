import React, { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import SoftSelect from "components/SoftSelect";
import { useNavigate, useParams } from "react-router-dom";
import SoftInput from "components/SoftInput";
import { Quiz } from "yaponuz/data/api";
import Swal from "sweetalert2";
import { FileController } from "yaponuz/data/api";


export default function QuestionCreate() {
    const [questionOptions, setQuestionOptions] = useState([
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
    ]);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null); // Track selected question type
    const [image, setImage] = useState(null); // Track uploaded image
    const [audio, setAudio] = useState(null); // Track uploaded audio
    const navigate = useNavigate();
    const [currentAnswer, setCurrentAnswer] = useState("Option 1");
    const { ID } = useParams()
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState(null);



    // The options you want to display in the select dropdown
    const questionTypes = [
        { value: 'DRAG_AND_DROP', label: 'Drag and Drop' },
        { value: 'FILL_IN_THE_BLANKS', label: 'Fill in the Blanks' },
        { value: 'FLASHCARD', label: 'Flashcard' },
        { value: 'IMAGE_BASED', label: 'Image-Based' },
        { value: 'LISTENING', label: 'Listening' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' }
    ];

    const handleAddInput = () => {
        setQuestionOptions([...questionOptions, { text: "", correctAnswer: false }]);
    };

    const handleRemoveInput = (index) => {
        const updatedOptions = questionOptions.filter((_, i) => i !== index);
        setQuestionOptions(updatedOptions);
    };

    const handleInputChange = (e, index) => {
        const updatedOptions = [...questionOptions];
        updatedOptions[index].text = e.target.value;
        setQuestionOptions(updatedOptions);
    };
    const handleCheckboxChange = (index) => {
        const updatedOptions = questionOptions.map((option, i) => {
            if (i === index) {
                setCurrentAnswer(option.text); // Устанавливаем правильный ответ
                return { ...option, correctAnswer: true };
            } else {
                return { ...option, correctAnswer: false };
            }
        });
        setQuestionOptions(updatedOptions);
    };


    const handleAudioChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudio(URL.createObjectURL(file));
            const uploadedImageId = await uploadPhoto(file); // Загружаем файл
            setFile(uploadedImageId); // Сохраняем ID для использования в CreateQuestion
        }
    };


    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(URL.createObjectURL(selectedFile)); // Для предпросмотра
            const uploadedImageId = await uploadPhoto(selectedFile); // Загружаем файл
            setFile(uploadedImageId); // Сохраняем ID для использования в CreateQuestion
        }
    };



    // Trigger the file input click for image upload
    const triggerImageFileInput = () => {
        document.getElementById('image-upload-input').click();
    };

    // Trigger the file input click for audio upload
    const triggerAudioFileInput = () => {
        document.getElementById('audio-upload-input').click();
    };

    const CreateQuestion = async () => {
        try {
            const NewData = {
                question: question, // Текст вопроса
                quizType: selectedQuestionType, // Тип вопроса
                option: questionOptions.map(option => option.text), // Опции для вопроса
                correctAnswer: currentAnswer, // Верный ответ (можно передавать только название правильного варианта)
                correctFlashCard: {
                    japanHiragana: null,
                    japanKanji: null,
                    uzb: null
                },
                correctOrder: null, // Порядок правильных ответов
                createdBy: localStorage.getItem('userId'),
                imageId: file || null, // Имя изображения (если есть)
                audioId: file || null, // Имя аудио (если есть)
                quizModuleId: ID
            };

            const response = await Quiz.createQuiz(NewData);
            navigate(-1)
            Swal.fire("New question added", response.message, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    };

    const uploadPhoto = async (file) => {
        const userHashId = localStorage.getItem('userId'); // Получаем ID пользователя
        const category = 'quiz'; // Категория загрузки

        if (!file) {
            console.error("Файл не выбран.");
            return null; // Если файл не выбран, возвращаем null
        }

        try {
            // Отправка файла через FileController.uploadFile
            const response = await FileController.uploadFile(file, category, userHashId);

            // Вывод успешного результата в консоль

            // Возвращаем ID загруженного файла
            return response.object.id;
        } catch (error) {
            // Вывод ошибки в консоль
            console.error("Ошибка при загрузке файла:", error.response?.data || error.message);

            // Возвращаем null в случае ошибки
            return null;
        }
    };




    return (
        <DashboardLayout>
            <DashboardNavbar />

            <SoftBox my={3}>
                <Card>
                    <SoftBox display="flex" justifyContent="space-between" p={3}>
                        <SoftTypography variant="h6">Create question</SoftTypography>
                        <SoftButton onClick={() => navigate(-1)}>Back</SoftButton>
                    </SoftBox>
                    <SoftBox p={3} style={{ width: '100%' }}>
                        <SoftBox mb={2}>
                            <SoftTypography mb={1} variant="h6">Select Question Type</SoftTypography>
                            <SoftSelect
                                className="w-full"
                                placeholder="Select Question Type"
                                menuPortalTarget={document.body} // Fix dropdown positioning
                                onChange={(selectedOption) => {
                                    setSelectedQuestionType(selectedOption.value); // Set the selected question type
                                }}
                                options={questionTypes}
                            />
                        </SoftBox>
                        <SoftBox style={{ width: '100%', marginBottom: '20px' }}>
                            <SoftTypography mb={1} variant="h6">Question</SoftTypography>
                            <SoftInput
                                placeholder='Question...'
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </SoftBox>
                        <SoftBox mb={2}>
                            <SoftTypography mb={1} variant="h6">Question Options</SoftTypography>
                            {questionOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                    <SoftInput
                                        placeholder={`Option ${index + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleInputChange(e, index)}
                                        style={{ marginRight: '10px', height: '50px' }} // Increased height
                                    />

                                    <SoftButton
                                        onClick={() => handleRemoveInput(index)}
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        -
                                    </SoftButton>
                                    <input
                                        type="checkbox"
                                        checked={option.correctAnswer}
                                        onChange={() => handleCheckboxChange(index)}
                                        style={{ marginLeft: '10px', height: '30px', width: '30px', cursor: 'pointer' }}
                                    />
                                </div>
                            ))}
                            <SoftButton
                                onClick={handleAddInput}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    borderRadius: '4px'
                                }}
                            >
                                + Add Option
                            </SoftButton>
                        </SoftBox>

                        {/* Conditionally render the image upload button when IMAGE_BASED is selected */}
                        {selectedQuestionType === 'IMAGE_BASED' && (
                            <SoftBox mb={2}>
                                <SoftTypography mb={1} variant="h6">Upload Image</SoftTypography>
                                <SoftButton
                                    onClick={triggerImageFileInput}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Select Image
                                </SoftButton>

                                <SoftBox>
                                    <input
                                        id="image-upload-input"
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: 'none', width: '100%' }} // Hide the file input
                                    />

                                    {image && (
                                        <div>
                                            <SoftTypography variant="body2">Image Preview:</SoftTypography>
                                            <img src={image} alt="Image Preview" style={{ width: '100%', height: 'auto' }} />
                                        </div>
                                    )}
                                </SoftBox>
                            </SoftBox>
                        )}

                        {/* Conditionally render the audio upload button when LISTENING is selected */}
                        {selectedQuestionType === 'LISTENING' && (
                            <SoftBox mb={2}>
                                <SoftTypography mb={1} variant="h6">Upload Audio</SoftTypography>
                                <SoftButton
                                    onClick={triggerAudioFileInput}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Select Audio
                                </SoftButton>

                                <SoftBox>
                                    <input
                                        id="audio-upload-input"
                                        type="file"
                                        onChange={handleAudioChange}
                                        accept="audio/*"
                                        style={{ display: 'none', width: '100%' }} // Hide the file input
                                    />

                                    {audio && (
                                        <div className="w-[100%]">
                                            <SoftTypography variant="body2">Audio Preview:</SoftTypography>
                                            <audio controls>
                                                <source className="w-[100%]" src={audio} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    )}
                                </SoftBox>
                            </SoftBox>
                        )}
                        <SoftButton
                            onClick={CreateQuestion}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                borderRadius: '4px'
                            }}
                        >
                            Create
                        </SoftButton>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}
