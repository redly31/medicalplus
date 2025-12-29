// app/router.tsx
import { createBrowserRouter, Navigate, redirect } from "react-router-dom"
import App from "./app"
import { ROUTES } from "../shared/model/routes"
import LoginPage from "@/features/auth/login.page"
import RegisterPage from "@/features/auth/register.page"
import DoctorsListPage from "@/features/doctors-list/ui/doctors-list.page"
import { Providers } from "./providers"
import { AuthGuard } from "./auth-guard"
import AdminPage from "@/features/admin/admin.page"
import DoctorDashboardPage from "@/features/doctor-dashboard/ui/doctor-dashboard.page"
import DoctorDetailPage from "@/features/doctors-list/ui/doctor-detail.page"
import ProfilePage from "@/features/profile/profile.page"

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
        element: <DoctorDetailPage />,
        loader: async ({ params }) => {
          if (!params.doctorId) throw redirect(ROUTES.DOCTORS_LIST)
          return params.doctorId
        },
      },
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: <AdminPage />,
      },
      {
        path: ROUTES.DOCTOR_DASHBOARD,
        element: <DoctorDashboardPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: "*",
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
    ],
  },
])
