import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SoftButton from "components/SoftButton";
import Swal from "sweetalert2";
import { Frown, Loader } from "lucide-react";


// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Context
import { ThemeProvider } from "./context/ThemeContext";
import RichBox from "./components/RichBox";
import Profile from "./components/Profile";
import Carousel from "./components/Carousel";
import SoftBox from "components/SoftBox";
import { Theme } from "yaponuz/data/api";

import { Save } from "lucide-react";

function EduTheme() {
  const [components, setComponents] = useState([]); // Список компонентов
  const [loading, setLoading] = useState(true)

  // Функция для обработки ответа от backend
  const fetchComponents = async () => {
    try {
      const response = await Theme.getAllTheme();
      const { componentList } = response.object;

      // Преобразуем данные в формат, который можно использовать для рендера
      const parsedComponents = componentList.map((item, index) => ({
        id: `component-${index}`, // Добавляем уникальный ID
        type: item.category || "UNKNOWN",
        context: item.context || "",
        title: item.title || "",
        description: item.description || "",
        imageId: item.imageId || null
      }));

      setComponents(parsedComponents);
      console.log("Fetched components:", parsedComponents); // Log the fetched components
    } catch (error) {
      console.error("Ошибка при получении данных:", error.message || error);
    } finally {
      setLoading(false)
    }
  };

  // Выполняем запрос при загрузке компонента
  useEffect(() => {
    fetchComponents();
  }, []);

  const addComponent = (type) => {
    setComponents((prevComponents) => {
      const updatedComponents = [
        ...prevComponents,
        { id: `component-${prevComponents.length}`, type },
      ];
      console.log("Components after adding:", updatedComponents); // Log after adding a component
      return updatedComponents;
    });
  };

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const updatedComponents = Array.from(components);
    const [removed] = updatedComponents.splice(source.index, 1);
    updatedComponents.splice(destination.index, 0, removed);

    setComponents(updatedComponents);
    console.log("Components after drag and drop:", updatedComponents); // Log after drag and drop
  };

  const handleDeleteComponent = (index) => {
    setComponents((prevComponents) => {
      const updatedComponents = prevComponents.filter((_, i) => i !== index);
      console.log("Components after delete:", updatedComponents); // Log after deleting a component
      return updatedComponents;
    });
  };
  const handleContentChange = (index, newContent) => {
    setComponents((prev) =>
      prev.map((component, i) =>
        i === index ? { ...component, context: newContent } : component
      )
    );
  };

  // Функция для обновления компонента
  const handleUpdate = (index, updatedData) => {
    setComponents((prevComponents) =>
      prevComponents.map((component, i) =>
        i === index ? { ...component, ...updatedData } : component
      )
    );
  };


  const renderComponents = () =>
    components.map((item, index) => {
      switch (item.type) {
        case "RICH_BOX":
          return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <RichBox
                    onContentChange={handleContentChange}
                    data={item}
                    index={index}
                    onDelete={handleDeleteComponent} // Передача функции удаления
                  />
                </div>
              )}
            </Draggable>
          );
        case "PROFILE":
          return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Profile
                    data={{
                      title: item.title,
                      subTitle: item.description, // Assuming description maps to subTitle
                      imageId: item.imageId,
                    }}
                    index={index}
                    onDelete={handleDeleteComponent}
                    onUpdate={(idx, updatedData) => {
                      setComponents((prev) =>
                        prev.map((comp, i) =>
                          i === idx ? { ...comp, ...updatedData } : comp
                        )
                      );
                    }}
                  />

                </div>
              )}
            </Draggable>
          );
        case "CAROUSEL":
          return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Carousel
                    index={index}
                    data={item}
                    onUpdate={handleUpdate}
                    onDelete={() => handleDeleteComponent(index)} // Передача функции удаления
                  />
                </div>
              )}
            </Draggable>
          );
        default:
          return null;
      }
    });

  // Function to handle the save (edit) request
  const handleSave = async () => {
    try {
      // Формируем данные для отправки
      const requestData = {
        componentList: components.map((component) => {
          switch (component.type) {
            case "RICH_BOX":
              return {
                category: component.type, // Категория
                context: component.context || "", // Контекст
              };
            case "PROFILE":
              return {
                category: component.type, // Категория
                title: component.title || "", // Заголовок
                subTitle: component.subTitle || "", // Подзаголовок
                imageId: component.imageId || '', // ID изображения
              };
            case "CAROUSEL":
              return {
                category: component.type, // Категория
                photoList: component.photoList || [], // Ensure this is the updated imageId
              };
            default:
              return {};
          }
        }),
        creatorId: localStorage.getItem("userId"), // ID создателя
        id: 8, // ID темы
      };

      // Отправляем данные на бэкенд
      const response = await Theme.updateTheme(requestData);
      Swal.fire("Save", response.message, "success");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to save data", "error");
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center pb-[50px] gap-y-4 justify-center flex-col">
  //       <Loader className="animate-spin ml-2 size-10" />
  //       <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
  //     </div>
  //   )
  // }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} className="min-h-screen">
        <ThemeProvider>
          <div className="flex flex-col max-w-[1200px] items-center justify-center px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <SoftButton
                  variant="gradient"
                  color="dark"
                  onClick={() => addComponent("RICH_BOX")}
                >
                  Rich Box
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="dark"
                  onClick={() => addComponent("PROFILE")}
                >
                  Profile
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="dark"
                  onClick={() => addComponent("CAROUSEL")}
                >
                  Carousel
                </SoftButton>
              </div>
              <div className="mt-4 md:mt-0">
                <SoftButton
                  variant="gradient"
                  color="dark"
                  onClick={handleSave} // Call the save function here
                >
                  Saqlash <Save className="size-4 ml-2" />
                </SoftButton>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center pb-[50px] h-[400px] gap-y-4 justify-center flex-col">
                <Loader className="animate-spin ml-2 size-10" />
                <p className="text-sm uppercase font-medium">Yuklanmoqda, Iltimos kuting</p>
              </div>
            ) : (
              <div className="mt-6 w-full flex flex-col gap-4">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="components" direction="vertical">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-full flex flex-col gap-4"
                      >
                        {renderComponents()}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        </ThemeProvider>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EduTheme;
