import axios from "axios";
const BASE_URL = "http://localhost:4000/api";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const codeBlocksService = {
  getAllCodeBlocks: async () => {
    try {
      const response = await api.get("/codeblocks");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  getCodeBlockById: async (id) => {
    try {
      const response = await api.get(`/codeblocks/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
