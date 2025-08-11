import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import PruebaPage from "./pages/PruebaPage";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/users"
                element={
                  <UserProvider>
                    <UsersPage />
                  </UserProvider>
                }
              />

              <Route path="/pruebita" element={<PruebaPage />}></Route>
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
