/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, redirectTo }) {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to={redirectTo} />
  );
}
