import { JWT_SECRET } from "@/constants"
import { jwtVerify, SignJWT } from "jose"
import { serialize, CookieSerializeOptions } from "cookie"
import { NextApiResponse } from "next"

type TokenPayload = {
	name: string
	email: string
	password: string
}

const secret = new TextEncoder().encode(JWT_SECRET)

export const generateToken = async (payload: TokenPayload) => {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("30d")
		.sign(secret)
}

export const verifyToken = async (token: string) => {
	const { payload, protectedHeader } = await jwtVerify(token, secret)
	return { payload, protectedHeader }
}

export const setCookie = (
	res: NextApiResponse,
	name: string,
	value: object | string,
	options: CookieSerializeOptions = {}
) => {
	const stringValue =
		typeof value === "object" ? "j:" + JSON.stringify(value) : value.toString()
	res.setHeader("Set-Cookie", serialize(name, stringValue, options))
}

export const clearCookie = (
	res: NextApiResponse,
	name: string,
	options: CookieSerializeOptions = {}
) => {
	res.setHeader("Set-Cookie", serialize(name, "", options))
}
