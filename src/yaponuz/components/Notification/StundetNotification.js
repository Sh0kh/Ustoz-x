import { Card, Stack } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Frown, Loader } from "lucide-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Header from "../account/settings/components/Header";
import { Users } from "yaponuz/data/api";
import { Notification } from "yaponuz/data/controllers/notification";
import AddNotification from "./components/AddNotifications";
import DeleteNotification from "./components/DeleteNotification";
import UpdateNotification from "./components/UpdateNotifications";

export default function StundetNotification() {
    const { ID } = useParams();
    const [loading, setLoading] = useState(true);
    const [notificationData, setNofificationData] = useState([]);
    const [userData, setUserData] = useState([])
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });


    const getOneUser = async () => {
        try {
            const response = await Users.getOneUser(ID);
            setUserData(response?.object)
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        }
    };

    const getNotification = async () => {
        setLoading(true);
        try {
            const data = {
                ID: ID,
                page: pagination.page,
                size: pagination.size,
            };

            const response = await Notification.getAllNotification(data);

            setNofificationData(response.object.content);
            setPagination({
                page: response.object.pageable.pageNumber,
                size: response.object.pageable.pageSize,
                totalElements: response.object.totalElements,
                totalPages: response.object.totalPages,
            });
        } catch (err) {
            console.log("Error fetching lesson reports: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNotification();
        getOneUser()
    }, [ID, pagination.page]);

    // Форматируем строки для карточек
    const renderCards = () => {
        return notificationData?.map((item) => (
            <Card key={item.id} style={{ padding: "16px", marginBottom: "16px", marginTop: '20px' }}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                    <SoftTypography variant="h6" fontWeight="medium">
                        {item?.title}
                    </SoftTypography>
                    <SoftBox display="flex" gap="10px" alignItems="center">
                        <UpdateNotification id={item?.notificationId} item={item} refetch={getNotification} />
                        <DeleteNotification id={item?.notificationId} refetch={getNotification} />
                    </SoftBox>
                </SoftBox>
                <SoftBox mt={2}>
                    <SoftTypography variant="body2" color="text">
                        {item?.description}
                    </SoftTypography>
                    {item?.photoId !== null && (
                        <img
                            src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${item.photoId}`}
                            alt={item.id}
                            style={{
                                borderRadius: '5px',
                                marginTop: '20px',
                                width: '300px',
                                height: 'auto',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </SoftBox>
            </Card>
        ));
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Header data={userData} />
                <Card style={{ margin: "10px 0px", padding: "16px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start">
                        <SoftTypography variant="h5" fontWeight="medium">
                            Student notification
                        </SoftTypography>
                        <Stack spacing={1} direction="row">
                            <AddNotification refetch={getNotification} />
                        </Stack>
                    </SoftBox>
                    {loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
                        </div>
                    ) : notificationData.length !== 0 ? (
                        <>
                            <SoftBox>{renderCards()}</SoftBox>
                            <SoftBox display="flex" justifyContent="end" mt={3}>
                                <button
                                    disabled={pagination.page === 0}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    style={{
                                        padding: "8px 16px",
                                        marginRight: "8px",
                                        cursor: pagination.page === 0 ? "not-allowed" : "pointer",
                                    }}
                                >
                                    <svg className="text-[20px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"></path></g></svg>
                                </button>
                                <button
                                    disabled={pagination.page === pagination.totalPages - 1}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    style={{
                                        padding: "8px 16px",
                                        cursor:
                                            pagination.page === pagination.totalPages - 1
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    <svg className="text-[20px] rotate-[180deg]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"></path></g></svg>
                                </button>
                            </SoftBox>
                        </>
                    ) : (
                        <div className="flex flex-col gap-y-4 items-center justify-center min-h-96">
                            <Frown className="size-20" />
                            <div className="text-center">
                                <p className="uppercase font-semibold">Afuski, hech narsa topilmadi</p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
        </DashboardLayout>
    );
}