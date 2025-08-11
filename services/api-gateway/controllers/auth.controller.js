import { makeRequest, getAuthHeaders } from "../libs/httpClient.js";
import {
  setCookies,
  clearCookies,
  refreshAccessToken,
} from "../libs/tokenService.js";

import { SERVICES } from "../config/services.config.js";

const getToken = (req) =>
  req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

export const loginController = async (req, res) => {
  try {
    const response = await makeRequest(
      "POST",
      `${SERVICES.AUTH}/api/login`,
      req.body
    );

    const { user, tokens } = response;

    // Establecer cookies
    setCookies(res, tokens);

    // Solo devolver datos del usuario al frontend
    res.json({
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};

export const logoutController = (req, res) => {
  clearCookies(res);
  res.json({ message: "Logged out successfully" });
};

export const verifyController = (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
};

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const response = await makeRequest(
      "POST",
      `${SERVICES.AUTH}/api/refresh-token`,
      { refreshToken }
    );

    const { accessToken } = response;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    clearCookies(res);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const token = getToken(req);

    const response = await makeRequest(
      "GET",
      "http://auth-service:3001/api/profile",
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

export const updateProfile = async (req, res) => {
  try {
    const token = getToken(req);
    const response = await makeRequest(
      "PUT",
      "http://auth-service:3001/api/profile",
      req.body,
      getAuthHeaders(token)
    );

    res.json({
      ...response,
      message: "Profile update successfully",
    });
  } catch (error) {
    console.error(
      "Updated profile error:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
};
