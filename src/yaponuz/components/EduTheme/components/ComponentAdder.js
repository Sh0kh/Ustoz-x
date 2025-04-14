import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "../context/ThemeContext";

function ComponentAdder() {
  const { addComponent } = useTheme();

  const components = [
    { type: "richBox", label: "Rich Box", icon: "text_fields" },
    { type: "profile", label: "Profile", icon: "person" },
    { type: "carousel", label: "Carousel", icon: "collections" },
    { type: "card", label: "Card", icon: "card_membership" },
    { type: "article", label: "Article", icon: "article" },
  ];

  return (
    <div className="flex flex-col">
      {components.map(({ type, label, icon }) => (
        <Tooltip key={type} title={label} placement="right" arrow>
          <button
            onClick={() => addComponent({ type, category: type.toUpperCase() })}
            className="border-b text-white bg-black px-3 h-auto hover:opacity-70 w-auto py-1"
          >
            <Icon>{icon}</Icon>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

export default ComponentAdder;
