import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SoftBox from "components/SoftBox";

export default function ErrorPage() {
    return (
        <SoftBox
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5", // Мягкий фон
                textAlign: "center",
                padding: "20px",
            }}
        >
            {/* Заголовок ошибки */}
            <Typography
                variant="h1"
                sx={{
                    fontSize: "10rem",
                    fontWeight: "bold",
                    color: "#ff4d4f", // Красный цвет для акцента
                    marginBottom: "20px",
                }}
            >
                404
            </Typography>

            {/* Описание ошибки */}
            <Typography
                variant="h4"
                sx={{
                    fontSize: "2rem",
                    fontWeight: "medium",
                    color: "#333",
                    marginBottom: "20px",
                }}
            >
                Oops! Sahifa topilmadi.
            </Typography>

            {/* Дополнительное описание */}
            <Typography
                variant="body1"
                sx={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "40px",
                }}
            >
                Kechirasiz, siz izlayotgan sahifa mavjud emas yoki ko‘chirib olingan.
            </Typography>


        </SoftBox>
    );
}