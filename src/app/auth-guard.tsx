import { ROUTES } from "@/shared/model/routes"
import { useSession } from "@/shared/model/session"
import type { ReactNode } from "react"
import { matchPath, Navigate, useLocation } from "react-router-dom"

type Role = "unauth" | "patient" | "doctor" | "admin"

const permissions: Record<string, Role[]> = {
  [ROUTES.LOGIN]: ["unauth"],
  [ROUTES.REGISTER]: ["unauth"],
  [ROUTES.DOCTORS_LIST]: ["unauth", "patient"],
  [ROUTES.DOCTOR_DETAIL]: ["unauth", "patient"],
  [ROUTES.PROFILE]: ["patient"],
  [ROUTES.DOCTOR_DASHBOARD]: ["doctor"],
  [ROUTES.ADMIN_DASHBOARD]: ["admin"],
}

const getHomePathForRole = (role: Role): string => {
  switch (role) {
    case "patient":
      return ROUTES.PROFILE
    case "doctor":
      return ROUTES.DOCTOR_DASHBOARD
    case "admin":
      return ROUTES.ADMIN_DASHBOARD
    default:
      return ROUTES.LOGIN
  }
}

interface AuthGuardProps {
  children: ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { session } = useSession()
  const role: Role = (session?.role as Role) || "unauth"
  const { pathname } = useLocation()

  let isAllowed = false

  for (const pattern in permissions) {
    if (matchPath({ path: pattern, end: true }, pathname)) {
      if (permissions[pattern].includes(role)) {
        isAllowed = true
      }
      break
    }
  }

  if (!isAllowed) {
    const redirectTo = getHomePathForRole(role)
    if (pathname === redirectTo) return <>{children}</>
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
