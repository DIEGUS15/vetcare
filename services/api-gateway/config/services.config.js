export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || "http://auth-service:3001",
  PATIENTS: process.env.PATIENTS_SERVICE_URL || "http://patients-service:3002",
  APPOINTMENT:
    process.env.APPOINTMENT_SERVICE_URL || "http://appointment-service:3003",
};
