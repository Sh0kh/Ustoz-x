/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";
import PropTypes from "prop-types";

// draft-js
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Custom styles for the MDEditor
import SoftEditorRoot from "components/SoftEditor/SoftEditorRoot";

// Material Dashboard 2 PRO React context
import { useSoftUIController } from "context";

function MDEditor({ defaultValue, onChange }) {
  const [controller] = useSoftUIController();
  const { darkMode } = controller;

  // Initialize the editor state with the default value
  const initialContent = defaultValue
    ? EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(defaultValue))
      )
    : EditorState.createEmpty();

  const [editorState, setEditorState] = React.useState(initialContent);

  // Update the parent component whenever the editor content changes
  const handleEditorChange = (newState) => {
    setEditorState(newState);
    const htmlContent = convertToHTML(newState.getCurrentContent());
    if (onChange) onChange(htmlContent);
  };

  return (
    <SoftEditorRoot ownerState={{ darkMode }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: ["inline", "blockType", "fontSize", "list", "textAlign", "link", "history"],
        }}
      />
    </SoftEditorRoot>
  );
}

// Setting default values for the props of MDEditor
MDEditor.defaultProps = {
  defaultValue: "",
  onChange: null,
};

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

export default MDEditor;

// import React from "react";

// // prop-types is a library for typechecking of props
// import PropTypes from "prop-types";

// // draft-js
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import { convertToHTML } from "draft-convert";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// // Custom styles for the MDEditor
// import SoftEditorRoot from "components/SoftEditor/SoftEditorRoot";

// // Material Dashboard 2 PRO React context
// import { useSoftUIController } from "context";

// function MDEditor({ value }) {
//   const [controller] = useSoftUIController();
//   const { darkMode } = controller;

//   const [convertedContent, setConvertedContent] = React.useState(null);
//   const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

//   React.useEffect(() => {
//     let html = convertToHTML(editorState.getCurrentContent());
//     setConvertedContent(html);
//   }, [editorState]);

//   return (
//     <SoftEditorRoot ownerState={{ darkMode }}>
//       {value && typeof value === "function" && value(convertedContent)}
//       <Editor editorState={editorState} onEditorStateChange={setEditorState} />
//     </SoftEditorRoot>
//   );
// }

// // Setting default values for the props of MDEditor
// MDEditor.defaultProps = {
//   value: () => {},
// };

// // Typechecking props for the MDEditor
// MDEditor.propTypes = {
//   value: PropTypes.func,
// };

// export default MDEditor;
