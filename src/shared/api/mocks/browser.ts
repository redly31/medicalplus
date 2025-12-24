import { setupWorker } from "msw/browser"
import { authHandlers } from "./handlers/auth"
import { adminHandlers } from "./handlers/admin"

export const worker = setupWorker(...authHandlers, ...adminHandlers)
