import { useState, useEffect } from "react";
import Logo from "../../../../assets/images/MainPageLogo.png";
import { NavLink } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header>
            <SoftBox
                sx={{
                    position: "fixed",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%",
                    maxWidth: "1230px",
                    border: "2px solid",
                    borderColor: "#1C1E2B",
                    marginTop: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    py: "10px",
                    px: '15px',
                    transition: "all 0.3s ease",
                    backgroundColor: scrolled ? "rgba(255, 255, 255, 0.3)" : "#fff",
                    backdropFilter: scrolled ? "blur(10px)" : "none",
                    zIndex: 1000,
                }}
            >
                <SoftBox
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <SoftBox
                        sx={{ display: "flex", gap: "px", alignItems: "center" }}
                    >
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{ width: "60px", maxWidth: "250px" }}
                        />
                        <SoftTypography
                            sx={{
                                fontWeight: 'bold',
                                color: '#1C1E2B !important',
                            }}
                        >
                            Ustoz-X
                        </SoftTypography>
                    </SoftBox>
                    <SoftBox sx={{ display: "flex", gap: "30px", alignItems: "center" }}>
                        <SoftBox
                            sx={{
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                gap: "30px",
                            }}
                        >
                            <NavLink to="/"
                                className="font-bold text-[#1C1E2B] text-[21px] transition-opacity duration-300 hover:opacity-50 no-underline"
                            >About Us</NavLink>
                            <NavLink to="/"

                                className="font-bold text-[#1C1E2B] text-[21px] transition-opacity duration-300 hover:opacity-50 no-underline"
                            >People </NavLink>
                            <NavLink to="/"
                                className="font-bold text-[#1C1E2B] text-[21px] transition-opacity duration-300 hover:opacity-50 no-underline"

                            >FAQ</NavLink>
                            <SoftButton
                                sx={{
                                    backgroundColor: '#1C1E2B',
                                    color: 'white !important',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: '#1C1E2B !important',
                                    },
                                }}
                            >
                                Contact
                            </SoftButton>
                        </SoftBox>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
        </header >
    );
}

