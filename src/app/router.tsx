import { createBrowserRouter, redirect } from "react-router-dom"
import App from "./app"
import { ROUTES } from "../shared/model/routes"
import LoginPage from "@/features/auth/login.page"
import RegisterPage from "@/features/auth/register.page"
import DoctorsListPage from "@/features/doctors-list/doctors-list.page"
import { Providers } from "./providers"

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
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
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.DOCTORS_LIST),
      },
      { path: ROUTES.DOCTORS_LIST, element: <DoctorsListPage /> },
    ],
  },
])
