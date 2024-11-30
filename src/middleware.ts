import { NextRequest, NextResponse } from "next/server";

import { getUser } from "./actions/user_actions";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = getTokenFromStorage(request);
  const userData = await getUser();

  const isRootPath = path === "/";

  if (!token && !isRootPath) {
    return new NextResponse("Access Denied: The Website is under construction", { status: 403 });
  }

  return NextResponse.next();
}

function getTokenFromStorage(request: NextRequest) {
  const cookies = request.cookies;
  // console.log("====cookies are coming here =======>",cookies, "===========>")
  const token = cookies.get("token");
  return token;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/",
    "/jobs",
    "/tracker"
  ],
};
