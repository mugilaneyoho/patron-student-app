import api from "./api";
import type { Course } from "../types/courseInterface";

interface BackendResponse {
  success: boolean;
  message: string;
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const classService = {
  getTodayClasses: async (): Promise<Course[]> => {
    const { data } = await api.get<BackendResponse>("classes/all", {
      params: { classtype: "ongoing" }
    });
    return data.data; 
  },

  getUpcomingClasses: async (): Promise<Course[]> => {
    const { data } = await api.get<BackendResponse>("classes/all", {
      params: { classtype: "upcoming" }
    });
    return data.data;
  },

  getCompletedClasses: async (): Promise<Course[]> => {
    const { data } = await api.get<BackendResponse>("classes/all", {
      params: { classtype: "completed" }
    });
    return data.data;
  }
};