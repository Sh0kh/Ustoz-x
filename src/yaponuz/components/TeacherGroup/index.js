// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftButton from "components/SoftButton";
import DataTable from "examples/Tables/DataTable";

import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import Stack from "@mui/material/Stack";

// Data
import { useEffect, useState } from "react";
import SoftBadge from "components/SoftBadge";

import { Group } from "yaponuz/data/controllers/group";
import { Frown, Loader } from "lucide-react";
import { NavLink } from "react-router-dom";


export default function TeacherGroup() {
    // variables
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true)


    // fetching data function
    const getAllGroups = async () => {
        setLoading(true)
        try {
            const response = await Group.getMyGroups();
            setGroups(response.object);
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        } finally {
            setLoading(false)
        }
    };

    // mounting
    useEffect(() => {
        getAllGroups();
    }, []);

    // table elements
    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "Guruh nomi", accessor: "name" },
        { Header: "Boshlanish sanasi", accessor: "startDate" },
        { Header: "Tugash sanasi", accessor: "endDate" },
        { Header: "Yaratilgan vaqti", accessor: "createdAt" },
    ];

    const rows = groups?.map((group) => {
        const createdAt = group.createdAt
            ? new Date(group.createdAt).toISOString().replace(/T/, " ").replace(/\..+/, "")
            : "null";
        return {
            id: group.id,
            name: (
                <NavLink className={'text-blue-400'} to={`/mygroup/${group?.id}`}>
                    {group.name}
                </NavLink>
            ),
            startDate: group.startDate,
            endDate: group.endDate,
            createdAt,
        };
    });


    const tabledata = {
        columns,
        rows,
    };

    const myx = { margin: "0px 30px" };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card style={{ margin: "10px 0px" }}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                        <SoftBox lineHeight={1}>
                            <SoftTypography variant="h5" fontWeight="medium">
                                Barcha guruhlar
                            </SoftTypography>
                        </SoftBox>
                    </SoftBox>

                    {loading ? (
                        <div className="flex items-center gap-y-4 justify-center flex-col h-[400px]">
                            <Loader className="animate-spin ml-2 size-10" />
                            <p className="text-sm uppercase font-medium">Yuklanmoqda, iltimos kuting</p>
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
                                <p className="uppercase font-semibold">Afsuski, hech narsa topilmadi</p>
                                <p className="text-sm text-gray-700">
                                    Balki, filtrlardan tozalab ko‘rish kerakdir
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}
