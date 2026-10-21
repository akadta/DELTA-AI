import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import MainLayout from "./layouts/MainLayout";
import Main from "./pages/main/Main";
import MainProtectedLayout from "./routes/MainProtectedLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<MainProtectedLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/main" element={<Main />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
