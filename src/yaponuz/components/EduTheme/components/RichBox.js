import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { useTheme } from "../context/ThemeContext";
import React from "react";
function RichBox({ data, index, onDelete, onContentChange }) {
  const [content, setContent] = React.useState(data.context || "");

  const handleContentChange = (value) => {
    setContent(value);
    onContentChange(index, value); // Передаем изменения родителю
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
    <div className="w-[100%] border-[2px] bg-[white] min-h-[400px]  p-8 rounded-md shadow-xl flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="uppercase font-semibold">Rich Box</h3>
        <button
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
        </button>
      </div>

      <div className="my-2">
        <ReactQuill
          className="h-48"
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="my-10 bg-sky-500"></div>
    </div>
  );
}

RichBox.propTypes = {
  data: PropTypes.shape({
    context: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
};

export default RichBox;
