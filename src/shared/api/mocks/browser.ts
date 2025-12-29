import { setupWorker } from "msw/browser"
import { authHandlers } from "./handlers/auth"
import { adminHandlers } from "./handlers/admin"
import { userHandlers } from "./handlers/user"
import { doctorHandlers } from "./handlers/doctor"

export const worker = setupWorker(
  ...authHandlers,
  ...adminHandlers,
  ...userHandlers,
  ...doctorHandlers
)
