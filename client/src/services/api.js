// importing the axios library for making HTTP requests
import axios from "axios";
// define the base URL for the api
const BASE_URL = "http://localhost:4000/api";
const api = axios.create({
  baseURL: BASE_URL, //setting the base URL for all api requests
  headers: { "Content-Type": "application/json" }, //setting content type header to json for all requests
});
//object with methods to interact with the codeblocks api
export const codeBlocksService = {
  //func to get all code block
  getAllCodeBlocks: async () => {
    try {
      //get request to fetch all code blocks from the server
      const response = await api.get("/codeblocks");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  //func to get a specific code block by its ID
  getCodeBlockById: async (id) => {
    try {
      //get request to fetch a specific code block by the id from the server
      const response = await api.get(`/codeblocks/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
