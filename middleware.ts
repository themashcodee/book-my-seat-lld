import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/helpers"

const public_routes = ["/login", "/api/login"]

export async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl
	const homeURL = new URL("/", origin)
	const loginURL = new URL(`/login`, origin)

	try {
		if (pathname.startsWith("/_next")) return NextResponse.next()
		// if (pathname.startsWith("/api")) return NextResponse.next()

		const token = req.cookies.get("auth_token")
		if (!token)
			return public_routes.includes(pathname)
				? NextResponse.next()
				: NextResponse.redirect(loginURL)

		const result = await verifyToken(token.value)
		if (pathname === "/login") return NextResponse.redirect(homeURL)
		console.info("MIDDLEWARE VERIFY TOKEN RESPONSE", result)

		return NextResponse.next()
	} catch (err) {
		console.error("ERROR IN MIDDLEWARE", err)

		if (public_routes.includes(pathname)) return NextResponse.next()
		return NextResponse.redirect(loginURL)
	}
}
