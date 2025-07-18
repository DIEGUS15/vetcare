import { makeRequest, getAuthHeaders } from "../libs/httpClient.js";

const getToken = (req) =>
  req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

export const getPetsController = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "GET",
      `http://patients-service:3002/api/pets?${new URLSearchParams(req.query)}`,
      null,
      getAuthHeaders(token)
    );

    res.json(response);
  } catch (error) {
    console.error("Get pets error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};

export const createPetController = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "POST",
      "http://patients-service:3002/api/pet",
      req.body,
      getAuthHeaders(token)
    );

    res.json(response);
  } catch (error) {
    console.error("Pet creation error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};

export const getPetsByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const token = getToken(req);

    const response = await makeRequest(
      "GET",
      `http://patients-service:3002/api/pets/user/${userId}`,
      null,
      getAuthHeaders(token)
    );

    res.json(response);
  } catch (error) {
    console.error(
      "Get user pets error:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};
