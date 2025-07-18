import axios from "axios";

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "http://auth-service:3001/api/refresh-token",
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};

export const setCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    path: "/",
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: "/",
  });
};

export const clearCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};
