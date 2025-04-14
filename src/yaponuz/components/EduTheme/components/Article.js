import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import ReactQuill from "react-quill";
import { FileUpload } from "@mui/icons-material";
import { Upload } from "lucide-react";

function Article({ data, index }) {
  const { updateComponent, removeComponent } = useTheme();
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState(data.description || "");
  const [photoId, setPhotoId] = useState(data.photoId || "");

  const handleUpdate = () => {
    updateComponent(index, {
      ...data,
      title,
      description,
      photoId: parseInt(photoId),
    });
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <div className="w-[750px] border-l-[6px] border-l-violet-500  h-auto border-4 p-8 rounded-md shadow-xl flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="uppercase font-semibold">Article</h3>
        <p className="text-sm text-gray-700">
          Siz bu block yordamida article, ya`ni maqola qo`shishingiz mumkin.
        </p>
      </div>
      <div className="flex flex-col justify-between gap-y-1">
        <div>
          <SoftTypography variant="caption">
            Maqola (article) nomi nima? Iltimos maqola nomini kiriting
          </SoftTypography>
          <SoftInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Maqola nomi"
            className="w-full"
          />
        </div>
        <div className="">
          <SoftTypography variant="caption">Maqola uchun rasm tanlang</SoftTypography>
          <label htmlFor="articleId">
            <div className="w-full h-56 flex flex-col gap-y-3 items-center justify-center border-4 border-dotted rounded-xl hover:cursor-pointer hover:opacity-50">
              <Upload className="size-12" />
              <div>
                <p className="text-sm text-gray-600">Rasm tanlash uchun bu yerni bosing</p>
              </div>
            </div>
          </label>
          <input type="file" id="articleId" placeholder="Photo ID" className="w-full hidden" />
        </div>
        <div className="h-80">
          <SoftTypography variant="caption">
            Maqola haqida ma`lumotlar kiriting. Va ma`lumotlarni formatlashni unutmang.
          </SoftTypography>
          <ReactQuill className="h-56" theme="snow" modules={modules} formats={formats} />
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <SoftButton variant="gradient" color="error" onClick={() => removeComponent(index)}>
          <Icon>delete</Icon>&nbsp; O`chirish
        </SoftButton>
        <SoftButton variant="gradient" color="dark" onClick={handleUpdate}>
          <Icon>save</Icon>&nbsp; Yangilash
        </SoftButton>
      </div>
    </div>
  );
}

export default Article;

Article.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    photoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  index: PropTypes.number.isRequired,
};
