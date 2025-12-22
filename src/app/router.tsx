// app/router.tsx
import { createBrowserRouter, Navigate, redirect } from "react-router-dom"
import App from "./app"
import { ROUTES } from "../shared/model/routes"
import LoginPage from "@/features/auth/login.page"
import RegisterPage from "@/features/auth/register.page"
import DoctorsListPage from "@/features/doctors-list/doctors-list.page"
import { Providers } from "./providers"
import { AuthGuard } from "./auth-guard"

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <AuthGuard>
          <App />
        </AuthGuard>
      </Providers>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.DOCTORS_LIST,
        element: <DoctorsListPage />,
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.DOCTORS_LIST),
      },
      {
        path: ROUTES.DOCTOR_DETAIL,
        element: <div>Doctor Detail Page</div>,
      },
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: <div>Admin dash Page</div>,
      },
      {
        path: ROUTES.DOCTOR_DASHBOARD,
        element: <div>Doctor dash Page</div>,
      },
      {
        path: ROUTES.PROFILE,
        element: <div>Profile Page</div>,
      },
      {
        path: "*",
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
    ],
  },
])
