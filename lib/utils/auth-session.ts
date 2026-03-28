import { cookies } from "next/headers";

const SESSION_COOKIE = "session_user_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setUserSession(userId: string) {
      const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}


export async function getUserSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
