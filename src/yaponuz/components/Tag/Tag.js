import * as React from "react";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Stack,
    TextField,
    Button,
} from "@mui/material";
import { Plus, Delete, Frown, Loader } from "lucide-react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { TagController } from "yaponuz/data/controllers/tag";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import DeleteTag from "./Components/DeleteTag";

export default function Tag() {
    const [loading, setLoading] = useState(false);
    const [tag, setTag] = useState([]);
    const [name, setName] = useState("");

    const getTag = async () => {
        setLoading(true);
        try {
            const response = await TagController.getAllTag();
            setTag(response?.object);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const createTag = async () => {
        if (!name.trim()) return;
        try {
            await TagController.createTag({ name });
            setName("");
            getTag();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTag();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card
                variant="outlined"
                sx={{
                    mt: 3,

                    p: 3,
                    borderRadius: 2,
                    background: "#f5f7fa",
                    overflow: "visible",
                }}
            >
                <Box mb={3}>
                    <Typography variant="h4" fontWeight="bold" mb={3}>
                        Taglar
                    </Typography>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="flex-end" gap='10px' >
                        <SoftBox className={'w-full'}>
                            <Typography variant="h5" fontWeight="bold" mb={1}>
                                Tegdi sozlari
                            </Typography>
                            <SoftInput
                                fullWidth
                                label="Yangi tag nomi"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </SoftBox>
                        <SoftButton
                            variant="gradient"
                            onClick={createTag}
                            color="dark"
                            style={{ height: '40px' }}
                        >
                            Qo‘shish
                        </SoftButton>
                    </SoftBox   >
                </Box>
            </Card>
            {loading ? (
                <Box textAlign="center" py={5}>
                    <Loader className="animate-spin size-10 mx-auto mb-2" />
                    <Typography variant="body2" color="textSecondary">
                        Yuklanmoqda, iltimos kuting...
                    </Typography>
                </Box>
            ) : tag.length > 0 ? (
                <Stack spacing={2} sx={{ my: 3 }} >
                    {tag.map((item) => (
                        <Card key={item.id} sx={{ width: "100%", }}>
                            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Yaratilgan sana: {new Date(item.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                <IconButton color="error" onClick={() => console.log("Delete", item.id)}>
                                    <DeleteTag id={item?.id} refetch={getTag}/>
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Box textAlign="center" py={5}>
                    <Frown className="size-20 mx-auto mb-2" />
                    <Typography variant="subtitle1">Hech qanday tag topilmadi</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Ehtimol, hali hech narsa qo‘shilmagan
                    </Typography>
                </Box>
            )}
            <Footer />
        </DashboardLayout>
    );
}
