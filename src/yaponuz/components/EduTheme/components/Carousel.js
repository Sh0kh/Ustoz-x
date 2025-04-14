import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";

import {  useEffect } from "react";


function Carousel({ data, index, onDelete, onUpdate }) {
  const [photoList, setPhotoList] = useState(data.photoList?.join(", ") || "");

  useEffect(() => {
    const updatedPhotoList = photoList
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    // Автоматически передаём данные родителю
    onUpdate(index, { ...data, photoList: updatedPhotoList });
  }, [photoList]); // Вызывается при каждом изменении photoList

  return (
    <Card className="p-4 w-full">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-gray-700 uppercase font-semibold mb-[10px]">Carousel</h3>
        <SoftButton
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
          onClick={() => onDelete(index)}
        >
          Delete
        </SoftButton>
      </div>
      <SoftBox mb={2}>
        <SoftInput
          value={photoList}
          onChange={(e) => setPhotoList(e.target.value)}
          placeholder="Photo IDs (comma-separated)"
          className="w-full"
        />
      </SoftBox>
    </Card>
  );
}

Carousel.propTypes = {
  data: PropTypes.shape({
    photoList: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired, // Новый callback для автоматической передачи данных
};

export default Carousel;
