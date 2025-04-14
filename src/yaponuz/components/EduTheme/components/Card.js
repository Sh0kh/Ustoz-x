import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";

function CustomCard({ data, index }) {
  const { updateComponent, removeComponent } = useTheme();
  const [cardData, setCardData] = useState({
    backgroundColor: data.backgroundColor || "#FFFFFF",
    backgroundImageId: data.backgroundImageId || "",
    title: {
      context: data.title?.context || "",
      style: data.title?.style || "CENTER",
    },
    subtitle: {
      context: data.subtitle?.context || "",
      style: data.subtitle?.style || "LEFT",
    },
    image: {
      photoId: data.image?.photoId || "",
      style: data.image?.style || "RIGHT",
    },
    richBox: {
      context: data.richBox?.context || "",
      style: data.richBox?.style || "CENTER",
    },
  });

  const handleUpdate = () => {
    updateComponent(index, {
      ...data,
      ...cardData,
      backgroundImageId: parseInt(cardData.backgroundImageId),
      image: {
        ...cardData.image,
        photoId: parseInt(cardData.image.photoId),
      },
    });
  };

  const handleChange = (section, field, value) => {
    setCardData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <Card className="p-4">
      <SoftBox mb={2}>
        <SoftInput
          type="color"
          value={cardData.backgroundColor}
          onChange={(e) => setCardData((prev) => ({ ...prev, backgroundColor: e.target.value }))}
          placeholder="Background Color"
          className="w-full mb-2"
        />
        <SoftInput
          type="number"
          value={cardData.backgroundImageId}
          onChange={(e) => setCardData((prev) => ({ ...prev, backgroundImageId: e.target.value }))}
          placeholder="Background Image ID"
          className="w-full mb-2"
        />
      </SoftBox>

      <SoftBox mb={2}>
        <SoftInput
          value={cardData.title.context}
          onChange={(e) => handleChange("title", "context", e.target.value)}
          placeholder="Title"
          className="w-full mb-2"
        />
        <FormControl fullWidth className="mb-2">
          <InputLabel>Title Style</InputLabel>
          <Select
            value={cardData.title.style}
            onChange={(e) => handleChange("title", "style", e.target.value)}
          >
            <MenuItem value="LEFT">Left</MenuItem>
            <MenuItem value="CENTER">Center</MenuItem>
            <MenuItem value="RIGHT">Right</MenuItem>
          </Select>
        </FormControl>
      </SoftBox>

      <SoftBox mb={2}>
        <SoftInput
          value={cardData.subtitle.context}
          onChange={(e) => handleChange("subtitle", "context", e.target.value)}
          placeholder="Subtitle"
          className="w-full mb-2"
        />
        <FormControl fullWidth className="mb-2">
          <InputLabel>Subtitle Style</InputLabel>
          <Select
            value={cardData.subtitle.style}
            onChange={(e) => handleChange("subtitle", "style", e.target.value)}
          >
            <MenuItem value="LEFT">Left</MenuItem>
            <MenuItem value="CENTER">Center</MenuItem>
            <MenuItem value="RIGHT">Right</MenuItem>
          </Select>
        </FormControl>
      </SoftBox>

      <SoftBox mb={2}>
        <SoftInput
          type="number"
          value={cardData.image.photoId}
          onChange={(e) => handleChange("image", "photoId", e.target.value)}
          placeholder="Image Photo ID"
          className="w-full mb-2"
        />
        <FormControl fullWidth className="mb-2">
          <InputLabel>Image Style</InputLabel>
          <Select
            value={cardData.image.style}
            onChange={(e) => handleChange("image", "style", e.target.value)}
          >
            <MenuItem value="LEFT">Left</MenuItem>
            <MenuItem value="CENTER">Center</MenuItem>
            <MenuItem value="RIGHT">Right</MenuItem>
          </Select>
        </FormControl>
      </SoftBox>

      <SoftBox mb={2}>
        <SoftInput
          multiline
          rows={4}
          value={cardData.richBox.context}
          onChange={(e) => handleChange("richBox", "context", e.target.value)}
          placeholder="Rich Box Content"
          className="w-full mb-2"
        />
        <FormControl fullWidth className="mb-2">
          <InputLabel>Rich Box Style</InputLabel>
          <Select
            value={cardData.richBox.style}
            onChange={(e) => handleChange("richBox", "style", e.target.value)}
          >
            <MenuItem value="LEFT">Left</MenuItem>
            <MenuItem value="CENTER">Center</MenuItem>
            <MenuItem value="RIGHT">Right</MenuItem>
          </Select>
        </FormControl>
      </SoftBox>

      <SoftBox className="flex justify-between">
        <SoftButton variant="gradient" color="info" onClick={handleUpdate}>
          <Icon>save</Icon>&nbsp; Update
        </SoftButton>
        <SoftButton variant="gradient" color="error" onClick={() => removeComponent(index)}>
          <Icon>delete</Icon>&nbsp; Remove
        </SoftButton>
      </SoftBox>
    </Card>
  );
}

CustomCard.propTypes = {
  data: PropTypes.shape({
    backgroundColor: PropTypes.string,
    backgroundImageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.shape({
      context: PropTypes.string,
      style: PropTypes.string,
    }),
    subtitle: PropTypes.shape({
      context: PropTypes.string,
      style: PropTypes.string,
    }),
    image: PropTypes.shape({
      photoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      style: PropTypes.string,
    }),
    richBox: PropTypes.shape({
      context: PropTypes.string,
      style: PropTypes.string,
    }),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default CustomCard;
