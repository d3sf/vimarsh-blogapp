import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const protectedRoutes = [
        "/write",
        "/profile"
    
    ]; //Add Protected routes here

    if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
}


// Apply middleware only to protected routes
export const config = {
    matcher: [
        "/write",
        "/profile"
    ], // Adjust as needed
};