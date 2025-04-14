import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import SendSMS from "yaponuz/components/sidenavcom/SendSMS";
import Refresh from "yaponuz/components/sidenavcom/Refresh";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavList from "examples/Sidenav/SidenavList";
import SidenavItem from "examples/Sidenav/SidenavItem";
import SidenavCard from "examples/Sidenav/SidenavCard";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { useSoftUIController, setMiniSidenav } from "context";
import SoftButton from "components/SoftButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const itemName = pathname.split("/").slice(1)[1];

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const renderCollapse = (collapses) => {
    return collapses.map(({ name, collapse, route, href, key }) => {
      let returnValue;

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            name={name}
            active={key === itemName}
            open={openCollapse === key}
            onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: "none" }}>
            <SidenavItem name={name} active={key === itemName} />
          </Link>
        ) : (
          <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
            <SidenavItem name={name} active={key === itemName} />
          </NavLink>
        );
      }

      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });
  }
  const role = localStorage.getItem('user');


  const userLinks = [
    { to: '/users/students', label: 'Student' },
    { to: '/users/teacher', label: 'Teacher' },
    { to: '/users/supportCenter', label: 'Support Center' },
    { to: '/users/admins', label: 'Admin' },
  ];

  const filteredUserLinks = role === 'SAFASOFJQWEDWT'
    ? userLinks.filter(({ label }) => label === 'Student')
    : userLinks;

  // Фильтруем маршруты на основе роли
  const filteredRoutes = ['SAFASOFJQWEDWT', 'QWPFOQWOFQWFWS'].includes(role)
    ? routes?.filter(({ name }) => ['Group', 'SMS', 'Chats', 'Users'].includes(name))
    : routes;

  // Генерация отфильтрованных маршрутов
  const renderRoutes = filteredRoutes
    ?.filter(({ show }) => show !== false) // Фильтруем элементы, где show равно false
    .map(({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
      let returnValue;

      if (key === "users") {
        returnValue = (
          <Accordion
            key={key}
            expanded={openCollapse === key}
            onChange={() =>
              openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key)
            }
            sx={{
              width: '100%',
              margin: 0,
              boxShadow: "none",
              backgroundColor: "#F7F9FB",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              active={key === collapseName}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                padding: "0 1px",
                margin: 0,
                height: "50px",
                minHeight: "50px",
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                  padding: 0,
                  alignItems: "center",
                  height: "50px",
                  display: "flex",
                },
              }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
              />
              <Icon
                sx={{
                  color: "black",
                  transform: openCollapse === key ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                  marginLeft: "auto",
                }}
              >
                expand_more
              </Icon>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                padding: "0 8px",
                margin: 0,
                backgroundColor: "#F7F9FB",
                overflow: "hidden",
              }}
            >
              <ul style={{ listStyle: 'disc', padding: '0 40px', margin: 0 }}>
                {filteredUserLinks.map(({ to, label }) => (
                  <li
                    key={to}
                    style={{
                      marginTop: '10px',
                      marginBottom: '20px',
                      color: '#8E98AA',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <NavLink to={to}>{label}</NavLink>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        );
      } else if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: "none" }}>
              <SidenavCollapse name={name} icon={icon} active={key === collapseName} noCollapse={noCollapse} />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavCollapse name={name} icon={icon} noCollapse={noCollapse} active={key === collapseName}>
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          );
        } else {
          returnValue = (
            <Accordion key={key} expanded={openCollapse === key} onChange={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
              </AccordionSummary>
              <AccordionDetails>
                {collapse ? renderCollapse(collapse) : null}
              </AccordionDetails>
            </Accordion>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <SoftTypography
            key={key}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            opacity={0.6}
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </SoftTypography>
        );
      } else if (type === "divider") {
        returnValue = <Divider key={key} />;
      }

      return returnValue;
    });




  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav: transparentSidenav || false, miniSidenav }}
    >
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}  
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <SoftBox component="img" src={brand} alt="Soft UI Logo" width="1.5em" />}
          <SoftBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <SoftTypography component="h6" variant="button" fontWeight="medium">
              {brandName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
