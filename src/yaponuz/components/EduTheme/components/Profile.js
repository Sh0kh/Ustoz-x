import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";

function Profile({ data, index, onDelete, onUpdate }) {
  const [Title, setTitle] = useState(data?.title || "");
  const [SubTitle, setSubTitle] = useState(data?.subTitle || "");
  const [ImgeID, setImgeID] = useState(data?.imageId || "");

  // Функция для обновления данных в родителе
  const handleUpdate = (field, value) => {
    const updatedData = {
      title: field === "title" ? value : Title,
      subTitle: field === "subTitle" ? value : SubTitle,
      imageId: field === "imageId" ? parseInt(value, 10) : parseInt(ImgeID, 10),
    };
    onUpdate(index, updatedData); // Передаем данные родителю
  };

  return (
    <Card className="p-4 w-[100%]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 uppercase font-semibold mb-[10px]">Profile</h3>
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
          value={Title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleUpdate("title", e.target.value); // Автоматическое обновление
          }}
          placeholder="Profile Title"
          className="w-full mb-2"
        />
        <SoftInput
          value={SubTitle}
          onChange={(e) => {
            setSubTitle(e.target.value);
            handleUpdate("subTitle", e.target.value); // Автоматическое обновление
          }}
          placeholder="Profile Subtitle"
          className="w-full mb-2"
        />
        <SoftInput
          value={ImgeID}
          onChange={(e) => {
            setImgeID(e.target.value);
            handleUpdate("imageId", e.target.value); // Автоматическое обновление
          }}
          type="number"
          placeholder="Image ID"
          className="w-full"
        />
      </SoftBox>
    </Card>
  );
}

Profile.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subTitle: PropTypes.string,
    imageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired, // Добавлена проверка onUpdate
};

export default Profile;
