import React, { useState, useEffect, use } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Frown, Loader } from "lucide-react";
import AddModule from "./components/AddModule";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Quiz } from "yaponuz/data/api";
import SoftButton from "components/SoftButton";
import DeleteQuestion from "./components/DeleteQuestion";


export default function QuizeInfo() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const [lessonID, setLessonID] = useState(null)
    const [DeleteModal, setDeleteModal] = useState(false)
    const [QuestionData, setQuestionData] = useState(null)
    const navigate = useNavigate()
    const { ID } = useParams()

    const getAllQuiz = async () => {
        setLoading(true)
        try {
            const response = await Quiz.getAllQuiz(ID);
            setData(response.object);
        } catch (err) {
            console.error("Error from quiz list GET:", err);
            setError("Failed to fetch quizzes. Please try again later.");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllQuiz()
    }, [])



    return (
        <DashboardLayout>
            <DashboardNavbar />
            {error && (
                <SoftBox my={3}>
                    <SoftTypography variant="subtitle2" color="error">
                        {error}
                    </SoftTypography>
                </SoftBox>
            )}

            <SoftBox my={3}>
                {loading ? (
                    <div className="flex items-center pb-[50px] h-[500px] gap-y-4 justify-center flex-col">
                        <Loader className="animate-spin ml-2 size-10" />
                        <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
                    </div>
                ) : (
                    <Card>
                        <SoftBox display="flex" justifyContent="space-between" p={3}>
                            <SoftTypography variant="h6">All Question</SoftTypography>
                            <SoftButton
                                onClick={() => navigate(`/quizes/question/create/${ID}`)}
                            >
                                + ADD
                            </SoftButton>

                        </SoftBox>
                        <div className="overflow-x-auto">
                            {data && data?.length > 0 ? (
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="py-3 px-6 text-sm font-semibold text-left">ID</th>
                                            <th className="py-3 px-6 text-sm font-semibold text-left">Question Name</th>
                                            <th className="py-3 px-6 text-sm font-semibold text-left">Question type</th>
                                            <th className="py-3 px-6 text-sm font-semibold text-left">Created At</th>
                                            <th className="py-3 px-6 text-sm font-semibold text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((quiz) => (
                                            <tr key={quiz.id} className="border-t hover:bg-gray-50">
                                                <td className="py-3 px-6 text-sm">{quiz.id}</td>
                                                <td className="py-3 px-6 text-sm">
                                                    {quiz?.question}
                                                </td>
                                                <td className="py-3 px-6 text-sm">
                                                    {quiz?.quizType === 'DRAG_AND_DROP' && 'Drag and Drop'}
                                                    {quiz?.quizType === 'FILL_IN_THE_BLANKS' && 'Fill in the Blanks'}
                                                    {quiz?.quizType === 'FLASHCARD' && 'Flashcard'}
                                                    {quiz?.quizType === 'IMAGE_BASED' && 'Image-Based'}
                                                    {quiz?.quizType === 'LISTENING' && 'Listening'}
                                                    {quiz?.quizType === 'MULTIPLE_CHOICE' && 'Multiple Choice'}
                                                </td>

                                                <td className="py-3 px-6 text-sm">
                                                    {new Date(quiz.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-6 text-sm">
                                                    <button
                                                        onClick={() => { setQuestionData(quiz) }}
                                                        className="text-blue-500 hover:text-blue-700 text-xs font-medium text-[25px]"
                                                    >
                                                        <svg className="text-[25px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1q-.15.15-.15.36M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteModal(true); setQuestionData(quiz) }}
                                                        className="ml-4 text-red-500 hover:text-red-700 text-xs font-medium text-[25px]"
                                                    >
                                                        <svg className="text-[25px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                                    <Frown className="size-20" />
                                    <div className="text-center">
                                        <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
                                        <p className="text-sm text-gray-700">
                                            balki, filtrlarni tozalab ko`rish kerakdir
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card >
                )
                }
            </SoftBox >
            <Footer />
            <DeleteQuestion refetch={getAllQuiz} data={QuestionData} isOpen={DeleteModal} onClose={() => setDeleteModal(false)} />
        </DashboardLayout >
    );
}
