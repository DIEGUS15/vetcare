import { makeRequest, getAuthHeaders } from "../libs/httpClient.js";

const getToken = (req) =>
  req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

export const createAppointment = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "POST",
      "http://appointment-service:3003/api/appointment",
      req.body,
      getAuthHeaders(token)
    );

    res.json(response);
  } catch (error) {
    console.error(
      "Appointment creation error:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};
