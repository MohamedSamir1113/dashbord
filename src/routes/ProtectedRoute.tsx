import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // مفيش توكن → روح على /signin
    return <Navigate to="/signin" replace />;
  }

  // في توكن → اعرض الصفحة
  return <>{children}</>;
}
