import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import Swal from "sweetalert2";
import { FileController } from "yaponuz/data/api";

function Accounts() {
  const [files, setFiles] = useState({});
  const { ID } = useParams();
  const [loading, setLoading] = useState(true);

  // Получение файлов для студента
  const getFileStudent = useCallback(async () => {
    try {
      const response = await FileController.getStudentFiles(ID);
      if (response && response.object) {
        setFiles(response.object); // Загружаем файлы
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      Swal.fire("Error", "Failed to fetch files.", "error");
    } finally {
      setLoading(false);
    }
  }, [ID]);

  useEffect(() => {
    getFileStudent();
  }, [getFileStudent]);

  // Загрузка файла
  const uploadPhoto = async (file) => {
    const userHashId = localStorage.getItem("userId");
    const category = "user_document";

    if (!file) return null;

    try {
      const response = await FileController.uploadFile(file, category, userHashId);
      if (response && response.object && response.object.id) {
        return response.object; // Return full file object
      } else {
        console.error("Invalid response from server:", response);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      return null;
    }
  };

  // Обработка загрузки файла
  const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadPhoto(file);

      if (uploadedFile) {
        setFiles((prevFiles) => ({
          ...prevFiles,
          [key]: {
            ...prevFiles[key],
            id: uploadedFile.id, // Save the file ID
            fileName: uploadedFile.fileName,
            fileUrl: uploadedFile.fileUrl || "", // Assuming the server returns a URL
          },
        }));

        Swal.fire("Success", "File uploaded successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to upload file.", "error");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      Swal.fire("Error", "An error occurred during file upload.", "error");
    }
  };

  // Сохранение данных
  const handleSaveFiles = async () => {
    const updatedFiles = Object.keys(files).reduce((acc, key) => {
      const file = files[key];
      if (file && file.id) {
        acc[key] = {
          id: file.id,
        };
      }
      return acc;
    }, {});

    const payload = {
      data: updatedFiles, // Передаем только измененные файлы
      editEnable: true,
      studentId: ID,
    };

    try {
      const response = await FileController.editFile(payload);
      Swal.fire("Files Saved", response.message, "success");
    } catch (err) {
      console.error("Error saving files:", err);
      Swal.fire("Error", "Failed to save files.", "error");
    }
  };

  const hasFiles = Object.keys(files).length > 0;

  if (loading) {
    return (
      <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
        <Loader className="animate-spin ml-2 size-10" />
        <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-[30px]">
        <Button
          variant="contained"
          color="success"
          className="mx-auto w-full mb-[30px] block"
          onClick={handleSaveFiles}
        >
          Save
        </Button>
      </div>
      {hasFiles ? (
        Object.keys(files)
          .filter((key) => key.startsWith("file"))
          .map((key) => {
            const file = files[key];

            if (!file || !file.requiredFileName) {
              return null;
            }

            // Assuming the file URL comes from the server
            const fileUrl = file.fileUrl || "";

            return (
              <Card key={key} id={key} className="file-card mb-[20px] p-[20px]">
                <p>
                  <strong>{file.requiredFileName}</strong>
                </p>
                <p>{file.fileName ? `File: ${file.fileName}` : "No file uploaded"}</p>
                <div className="flex space-x-4 mt-[10px]">
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    className="flex-1"
                  >
                    Upload File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileUpload(e, key)}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="flex-1"
                    onClick={() => window.open(fileUrl, "_blank")}
                  >
                    View File
                  </Button>
                </div>
              </Card>
            );
          })
      ) : (
        <p className="text-center h-[300px]">No valid files available.</p>
      )}
    </div>
  );
}

export default Accounts;
