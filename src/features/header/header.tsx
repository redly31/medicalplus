import { ROUTES } from "@/shared/model/routes"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="h-28 flex items-center justify-between">
      <h2 className="font-bold text-xl">
        <Link to={ROUTES.HOME}>medicalplus</Link>
      </h2>
      <div className="flex gap-8 items-center">
        <Link to={ROUTES.DOCTORS_LIST}>Врачи</Link>
        <Link to={ROUTES.LOGIN}>Войти</Link>
        <Link to={ROUTES.REGISTER}>Регистрация</Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
