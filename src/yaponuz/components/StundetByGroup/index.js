import { Card, Stack } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Assembly } from "yaponuz/data/api";
import { useEffect, useState } from "react";
import { Frown, Loader } from "lucide-react";
import SoftButton from "components/SoftButton";
import { Users } from "yaponuz/data/api";
import { useParams } from "react-router-dom";



export default function StundetByGroup() {
    const { ID } = useParams()
    const [assembly, setAssembly] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [loading, setLoading] = useState(true)


    const getAseembly = async (page, size) => {
        setLoading(true);
        try {
            const response = await Users.getUsersAttendance(page, size, "", "", "", ID);
            setAssembly(response.object?.content);
            setTotalPages(response?.object?.totalPages);
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        } finally {
            setLoading(false);
        }
    };


    const rows = assembly?.map((item) => {
        return {
            id: item.id,
            Title: item.title,
            Date: item.date,
            Time: item.time,
            Group: item?.group?.name,
        };
    });


    // mounting
    useEffect(() => {
        getAseembly(page, size);
    }, [page, size, ID]);


    const columns = [
        { Header: "id", accessor: "id" },
        { Header: "Title", accessor: "Title" },
        { Header: "Date", accessor: "Date" },
        { Header: "Time", accessor: "Time" },
        { Header: "Group", accessor: "Group" },
        { Header: "action", accessor: "action" },
    ];

    const tabledata = {
        columns,
        rows,
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                        <SoftBox lineHeight={1}>
                            <SoftTypography variant="h5" fontWeight="medium">
                                Student
                            </SoftTypography>
                        </SoftBox>
                    </SoftBox>
                    {loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
                        </div>
                    ) : tabledata?.rows?.length !== 0 ? (
                        <DataTable
                            table={tabledata}
                            entriesPerPage={{
                                defaultValue: 20,
                                entries: [5, 7, 10, 15, 20],
                            }}
                            canSearch
                        />
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
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    )
}