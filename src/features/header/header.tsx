import { Link } from "react-router-dom"
import { ROUTES } from "@/shared/model/routes"
import { useSession } from "@/shared/model/session"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/shared/ui/components/ui/button"

type Role = "unauth" | "patient" | "doctor" | "admin"

interface NavLink {
  label: string
  path: string
}

const NAV_CONFIG: Record<Role, NavLink[]> = {
  unauth: [
    { label: "Врачи", path: ROUTES.DOCTORS_LIST },
    { label: "Войти", path: ROUTES.LOGIN },
    { label: "Регистрация", path: ROUTES.REGISTER },
  ],
  patient: [
    { label: "Врачи", path: ROUTES.DOCTORS_LIST },
    { label: "Профиль", path: ROUTES.PROFILE },
  ],
  doctor: [{ label: "Панель врача", path: ROUTES.DOCTOR_DASHBOARD }],
  admin: [{ label: "Админ-панель", path: ROUTES.ADMIN_DASHBOARD }],
}

export function Header() {
  const { session, logout } = useSession()
  const role: Role = (session?.role as Role) || "unauth"

  const navLinks = NAV_CONFIG[role]

  return (
    <header className="h-28 flex items-center justify-between">
      <h2 className="font-bold text-xl">
        <Link to={ROUTES.HOME}>medicalplus</Link>
      </h2>

      <div className="flex gap-8 items-center">
        <nav className="flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {role !== "unauth" && <Button onClick={logout}>Выйти</Button>}
        </div>
      </div>
    </header>
  )
}
