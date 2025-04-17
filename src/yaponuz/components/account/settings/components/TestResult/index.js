import { Card, Stack } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import { Frown, Loader } from "lucide-react";
import AddResult from "./component/AddResult";
import { testResult } from "yaponuz/data/controllers/testResult";
import DeleteResult from "./component/DeleteResult";
import EditResult from "./component/EditResult";


export default function TestResult() {

    const { ID } = useParams()
    const [loading, setLoading] = useState(true)
    const [reportData, setReportData] = useState([])

    const getAllTestResult = async () => {
        setLoading(true)
        try {
            const data = {
                studentId: ID,
            }
            const response = await testResult.getTestResult(data);
            setReportData(response.object);
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllTestResult()
    }, [ID])


    const rows = reportData?.map((item) => {
        return {
            id: item.id,
            Title: item.title,
            Score: item.score,
            Date: item.date,
            action: (
                <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftBox>
                        <EditResult item={item} refetch={getAllTestResult}/>
                    </SoftBox>
                    <SoftBox>
                        <DeleteResult id={item?.id} refetch={getAllTestResult} />
                    </SoftBox>
                </SoftBox>
            )
        };
    });


    const columns = [
        { Header: "id", accessor: "id" },
        { Header: "Title", accessor: "Title" },
        { Header: "Score", accessor: "Score" },
        { Header: "Date", accessor: "Date" },
        { Header: "action", accessor: "action" },
    ];

    const tabledata = {
        columns,
        rows,
    };



    return (
        <SoftBox my={3}>
            <Card style={{ margin: "10px 0px" }}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={3}>
                    <SoftBox lineHeight={1}>
                        <SoftTypography variant="h5" fontWeight="medium">
                            Test result
                        </SoftTypography>
                    </SoftBox>
                    <SoftBox display="flex" justifyContent="space-between" gap='10px'>
                        <Stack spacing={1} direction="row">
                            <AddResult refetch={getAllTestResult} />
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
                            <p className="text-sm text-gray-700">
                                balki, filtrlarni tozalab ko`rish kerakdir
                            </p>
                        </div>
                    </div>
                )}
            </Card>
        </SoftBox>
    )
}