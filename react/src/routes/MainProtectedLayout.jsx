import { Navigate, Outlet } from "react-router-dom";

function MainProtectedLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}

export default MainProtectedLayout;
