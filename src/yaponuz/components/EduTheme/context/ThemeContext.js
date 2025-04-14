import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeComponents, setThemeComponents] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [creatorId, setCreatorId] = useState(1001);
  const [eduCenterAdminId, setEduCenterAdminId] = useState(2001);

  const addComponent = (component) => {
    setThemeComponents([...themeComponents, component]);
  };

  const updateComponent = (index, updatedComponent) => {
    const newComponents = [...themeComponents];
    newComponents[index] = updatedComponent;
    setThemeComponents(newComponents);
  };

  const removeComponent = (index) => {
    setThemeComponents(themeComponents.filter((_, i) => i !== index));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeComponents,
        backgroundColor,
        creatorId,
        eduCenterAdminId,
        setBackgroundColor,
        setCreatorId,
        setEduCenterAdminId,
        addComponent,
        updateComponent,
        removeComponent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
