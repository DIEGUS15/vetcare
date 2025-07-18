import { makeRequest, getAuthHeaders } from "../libs/httpClient.js";

const getToken = (req) =>
  req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

export const registerController = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "POST",
      "http://auth-service:3001/api/register",
      req.body,
      getAuthHeaders(token)
    );

    res.json({
      ...response,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "GET",
      "http://auth-service:3001/api/users",
      null,
      getAuthHeaders(token)
    );

    res.json(response);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "PUT",
      `http://auth-service:3001/api/users/${req.params.id}`,
      req.body,
      getAuthHeaders(token)
    );

    res.json({
      ...response,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};
