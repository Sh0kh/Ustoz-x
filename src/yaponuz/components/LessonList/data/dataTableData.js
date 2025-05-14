import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import DefaultCell from "layouts/ecommerce/orders/order-list/components/DefaultCell";
import StatusCell from "layouts/ecommerce/orders/order-list/components/StatusCell";
import { Lesson } from "yaponuz/data/controllers/lesson";
import SoftButton from "components/SoftButton";
import { Eye, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import PreviewLesson from "./PreviewLesson";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

// Keep all existing cell wrapper components unchanged
const CellWrapper = ({ children }) => children;
CellWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const IdCellWrapper = ({ value }) => (
  <CellWrapper>
    <span>
      {value}
    </span>
  </CellWrapper>
);
IdCellWrapper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const DefaultCellWrapper = ({ value }) => (
  <CellWrapper>
    <DefaultCell value={value} />
  </CellWrapper>
);
DefaultCellWrapper.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const StatusCellWrapper = ({ value }) => {
  let status;
  if (value === false) {
    status = <StatusCell icon="close" color="error" status="Not Active" />;
  } else {
    status = <StatusCell icon="done" color="success" status="Active" />;
  }
  return <CellWrapper>{status}</CellWrapper>;
};
StatusCellWrapper.propTypes = {
  value: PropTypes.bool.isRequired,
};

const LessonMinuteCellWrapper = ({ value }) => (
  <CellWrapper>
    <DefaultCell value={`${value} min`} />
  </CellWrapper>
);
LessonMinuteCellWrapper.propTypes = {
  value: PropTypes.number.isRequired,
};

const ModuleIdCellWrapper = ({ value }) => (
  <CellWrapper>
    <DefaultCell value={`#${value}`} />
  </CellWrapper>
);
ModuleIdCellWrapper.propTypes = {
  value: PropTypes.number.isRequired,
};

const ActionCellWrapper = ({ value }) => {
  const navigate = useNavigate();

  const deleteItem = async (id) => {
    try {
      const newSwal = Swal.mixin({
        customClass: {
          confirmButton: "button button-success",
          cancelButton: "button button-error",
        },
        buttonsStyling: false,
      });

      newSwal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
              title: "Deleting...",
              text: "Please Wait!",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            const response = await Lesson.deleteLesson(id);
            loadingSwal.close();

            if (response.success) {
              newSwal.fire("Deleted!", response.message, "success").then(() => {
                window.location.reload();
              });
            } else {
              newSwal.fire("Not Deleted!", response.message, "error").then(() => {
                window.location.reload();
              });
            }
          }
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = () => {
    navigate(`/lessons/edit/${value.id}`, { state: { lessonData: value } });
  };

  return (
    <CellWrapper>
      <div className="flex space-x-2">
        <PreviewLesson value={value} />
        <Edit size={20} className="hover:opacity-70 cursor-pointer" onClick={handleEdit} />
        <Tooltip title="Delete" placement="top">
          <Trash
            size={20}
            className="hover:opacity-70 cursor-pointer"
            onClick={() => deleteItem(value.id)}
          />
        </Tooltip>
      </div>
    </CellWrapper>
  );
};
ActionCellWrapper.propTypes = {
  value: PropTypes.object.isRequired,
};

// Optimized useDataTableData hook
const useDataTableData = (
  initialPage = 0,
  initialSize = 20,
  initialModuleId = 0,
  initialName = ""
) => {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [moduleId, setModuleId] = useState(initialModuleId);
  const [name, setName] = useState(initialName);
  const [cache, setCache] = useState({});

  const clearFilters = useCallback(() => {
    setModuleId(0);
    setName("");
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Sort", accessor: "id", Cell: IdCellWrapper },
      { Header: "date", accessor: "createdAt", Cell: DefaultCellWrapper },
      { Header: "name", accessor: "name", Cell: DefaultCellWrapper },
      { Header: "lesson Minute", accessor: "lessonMinute", Cell: LessonMinuteCellWrapper },
      { Header: "module id", accessor: "moduleId", Cell: ModuleIdCellWrapper },
      { Header: "action", accessor: "action", Cell: ActionCellWrapper },
    ],
    []
  );

  const getAllLessons = useCallback(async () => {
    const cacheKey = `${page}-${size}-${moduleId}-${name}`;

    if (cache[cacheKey]) {
      setLessons(cache[cacheKey].lessons);
      setTotalPages(cache[cacheKey].totalPages);
      return;
    }

    setLoading(true);
    try {
      const response = await Lesson.getAllLessons(page, size, moduleId, name);
      const newLessons = response.object.content;
      const newTotalPages = response.object.totalPages;

      setLessons(newLessons);
      setTotalPages(newTotalPages);
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: { lessons: newLessons, totalPages: newTotalPages },
      }));
    } catch (error) {
      console?.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  }, [page, size, moduleId, name, cache]);

  const debouncedGetAllLessons = useMemo(() => debounce(getAllLessons, 300), [getAllLessons]);

  useEffect(() => {
    debouncedGetAllLessons();
    return () => debouncedGetAllLessons.cancel();
  }, [debouncedGetAllLessons]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  }, []);

  const dataTableData = useMemo(
    () => ({
      columns,
      rows: lessons.map((lesson) => ({
        id: `${lesson?.sort}`,
        createdAt: formatDate(lesson.createdAt),
        deleted: lesson.deleted,
        name: lesson.name,
        lessonMinute: lesson.lessonMinute,
        moduleId: lesson.moduleId,
        action: lesson,
      })),
    }),
    [columns, lessons, formatDate]
  );

  return {

    dataTableData,
    loading,
    totalPages,
    page,
    setPage,
    size,
    setSize,
    moduleId,
    setModuleId,
    name,
    setName,
    clearFilters,
  };
};

useDataTableData.propTypes = {
  initialPage: PropTypes.number,
  initialSize: PropTypes.number,
  initialModuleId: PropTypes.number,
  initialName: PropTypes.string,
};

useDataTableData.defaultProps = {
  initialPage: 0,
  initialSize: 20,
  initialModuleId: 0,
  initialName: "",
};

export default useDataTableData;
