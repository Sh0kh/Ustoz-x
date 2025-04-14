import { API_PATH, headerGet, header } from "../headers";

class Quiz {
  // Get all quizzes
  static getAllQuiz = async (page, size) => {
    const url = `${API_PATH}quiz/get/admin?page=${page}&size=${size}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
      throw new Error("Failed to fetch quizzes");
    }
  };
  
  static getAllQuiz = async (id) => {
    const url = `${API_PATH}quiz/get/all?quizModuleId=${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
      throw new Error("Failed to fetch quizzes");
    }
  };

  // Get all modules by lesson ID
  static getAllModuleByLessonId = async (id) => {
    const url = `${API_PATH}quiz/module/get?lessonId=${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching modules by lesson ID:", error);
      throw new Error("Failed to fetch modules");
    }
  };

  // Create new quiz
  static createQuiz = async (data) => {
    const url = `${API_PATH}quiz/create`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw new Error("Failed to create quiz");
    }
  };

  // Create new quiz module
  static createQuizModule = async (data) => {
    const url = `${API_PATH}quiz/module/create`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error creating quiz module:", error);
      throw new Error("Failed to create quiz module");
    }
  };

  // Delete a quiz
  static deleteQuiz = async (id) => {
    const url = `${API_PATH}quiz/delete?quizId=${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw new Error("Failed to delete quiz");
    }
  };

  // Get one quiz
  static getOneQuiz = async (id) => {
    const url = `${API_PATH}quiz/get-one?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching one quiz:", error);
      throw new Error("Failed to fetch one quiz");
    }
  };

  // Update quiz
  static updateQuiz = async (data) => {
    console.log(data)
    const url = `${API_PATH}quiz/update`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw new Error("Failed to update quiz");
    }
  };

  // Create new quiz (alternative endpoint)
  static createQuizCheck = async (data) => {
    const url = `${API_PATH}Quiz/check/create`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error creating quiz check:", error);
      throw new Error("Failed to create quiz check");
    }
  };

  // Delete one quiz (alternative endpoint)
  static deleteQuizCheck = async (id) => {
    const url = `${API_PATH}Quiz/check/delete?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error deleting quiz check:", error);
      throw new Error("Failed to delete quiz check");
    }
  };

  // Get one quiz (alternative endpoint)
  static getOneQuizCheck = async (id) => {
    const url = `${API_PATH}Quiz/check/get-one?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching one quiz check:", error);
      throw new Error("Failed to fetch one quiz check");
    }
  };

  // Update quiz (alternative endpoint)
  static updateQuizCheck = async (id, data) => {
    const url = `${API_PATH}Quiz/check/update?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error updating quiz check:", error);
      throw new Error("Failed to update quiz check");
    }
  };

  static updateQuizModule = async (data) => {
    const url = `${API_PATH}quiz/module/update`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: header,
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("Error updating quiz check:", error);
      throw new Error("Failed to update quiz check");
    }
  };

  static deleteQuizModule = async (id) => {
    const url = `${API_PATH}quiz/module/delete?id=${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headerGet,
      });
      return response.json();
    } catch (error) {
      console.error("Error deleting quiz check:", error);
      throw new Error("Failed to delete quiz check");
    }
  };



}

export { Quiz };
