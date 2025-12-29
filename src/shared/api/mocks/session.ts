import { jwtVerify, SignJWT } from "jose"
import type { ApiSchemas } from "../schema"
import { HttpResponse } from "msw"
import { JWTExpired } from "jose/errors"
import type { Session } from "@/shared/model/session"

const JWT_SECRET = new TextEncoder().encode("your-secret-key")
const ACCESS_TOKEN_EXPIRY = "5s"
const REFRESH_TOKEN_EXPIRY = "7d"

type SessionDTO = {
  id: string
  email: string
  role: ApiSchemas["UserRole"]
}

export async function generateTokens(session: SessionDTO) {
  const accessToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET)

  const refreshToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET)

  return { accessToken, refreshToken }
}

export function createRefreshTokenCookie(refreshToken: string) {
  return `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`
}

export async function verifyToken(token: string): Promise<Session> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as Session
}
export async function verifyTokenOrThrow(request: Request): Promise<Session> {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw HttpResponse.json(
      {
        message: "Authorization header missing or invalid format",
        code: 401,
      },
      { status: 401 }
    )
  }

  const token = authHeader.split(" ")[1]

  try {
    const session = await verifyToken(token)
    return session
  } catch (e) {
    let errorMessage = "Invalid token"
    if (e instanceof JWTExpired) {
      errorMessage = "Token expired"
    } else if (e instanceof Error) {
      errorMessage = `Token validation failed: ${e.message}`
    }

    console.error(
      `[MSW Auth Error] Token: ${token.substring(
        0,
        10
      )}... Verification failed:`,
      e
    )

    throw HttpResponse.json(
      {
        message: errorMessage,
        code: "INVALID_TOKEN",
      },
      { status: 401 }
    )
  }
}

export async function verifyRole(
  request: Request,
  allowedRoles: ApiSchemas["UserRole"][]
): Promise<Session> {
  const session = await verifyTokenOrThrow(request)

  if (!allowedRoles.includes(session.role)) {
    throw HttpResponse.json(
      {
        message: "Access denied. Insufficient role.",
        code: "FORBIDDEN",
      },
      { status: 403 }
    )
  }

  return session
}
