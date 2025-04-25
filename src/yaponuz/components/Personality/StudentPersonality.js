import { Card, Stack } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import AddPersonality from "./commponent/AddPersonality";
import { useEffect, useState } from "react";
import { report } from "yaponuz/data/api";
import { useParams } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import { Frown, Loader } from "lucide-react";
import SoftSelect from "components/SoftSelect";
import DeletePersonality from "./commponent/DeletePersonality";
import DetailPersonality from "./commponent/DetailPersonality";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { personality } from "yaponuz/data/controllers/personality";

export default function StudentPersonality() {

    const { ID } = useParams()
    const [loading, setLoading] = useState(true)
    const [reportData, setReportData] = useState([])


    const getPersonality = async () => {
        setLoading(true);
        try {

            const data = {
                studentId: ID,
            };

            // Выполняем запрос
            const response = await personality.getPersonality(data);
            setReportData(response.object);
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPersonality()
    }, [ID])


    const rows = reportData?.map((item) => {
        return {
            id: item.id,
            Score: item.score,
            date: item.date,
            action: (
                <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftBox>
                        <DetailPersonality item={item} />
                    </SoftBox>
                    {/* <SoftBox>
                        <EditReport item={item} refetch={getPersonality} />
                    </SoftBox> */}
                    <SoftBox>
                        <DeletePersonality id={item?.id} refetch={getPersonality} />
                    </SoftBox>
                </SoftBox>
            )
        };
    });


    const columns = [
        { Header: "id", accessor: "id" },
        { Header: "Score", accessor: "Score" },
        { Header: "Date", accessor: "date" },
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
                                Personality
                            </SoftTypography>
                        </SoftBox>
                        <SoftBox display="flex" justifyContent="space-between" gap='10px'>
                            <Stack spacing={1} direction="row">
                                <AddPersonality refetch={getPersonality} />
                            </Stack>
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

                            </div>
                        </div>
                    )}
                </Card>
            </SoftBox>
        </DashboardLayout>
    )
}