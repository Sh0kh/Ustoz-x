import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import routes from "routes";
import { useSoftUIController, setMiniSidenav } from "context";
import Login from "yaponuz/components/Login";
import SubCategories from "yaponuz/components/Categories/SubCategories";
import ArticleList from "yaponuz/components/Articles/Articles";
import Logo from "./assets/images/MainPageLogo.png";
import NewLesson from "yaponuz/components/LessonList/pages/NewLesson";
import { GetAuth } from "yaponuz/data/api";
import MainPage from "yaponuz/components/MainPage";
import Default from "layouts/dashboards/default";
import Error404 from "layouts/authentication/error/404";
import ErrorPage from "yaponuz/components/ErrorPage";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/" || pathname === "/login/web") {
      return;
    }

    const checkTokenExpiration = () => {
      if (GetAuth.isTokenExpired()) {
        navigate("/login/web");
      }
    };

    checkTokenExpiration();
  }, [pathname, navigate]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  // Check if user is authenticated
  const isAuthenticated = !GetAuth.isTokenExpired();

  // Don't show sidenav on MainPage or ErrorPage
  const shouldShowSidenav =
    layout === "dashboard" &&
    isAuthenticated &&
    pathname !== "/" &&
    pathname !== "/error"; // Добавляем проверку для /error

  return (
    <ThemeProvider theme={theme}>
      {shouldShowSidenav && (
        <>
          <CssBaseline />
          <Sidenav
            color={sidenavColor}
            brand={Logo}
            brandName="Ustoz-X"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}

      <Routes>
        <Route path="/login/web" element={<Login />} />
        <Route path="/error" element={<ErrorPage />} /> {/* Убедитесь, что путь правильный */}

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            {getRoutes(routes)}
            <Route path="/articles/categories/:id" element={<SubCategories />} />
            <Route path="/articles/article/:article" element={<ArticleList />} />
            <Route path="/lessons/new" element={<NewLesson />} />
            <Route path="/lessons/edit/:id" element={<NewLesson />} />
            <Route path="*" element={<Navigate to="/error" />} />
          </>
        ) : (
          <Route path="*" element={pathname === "/dashboards" ? <Default /> : <Navigate to="/login/web" />} />
        )}
      </Routes>
    </ThemeProvider>
  );
}