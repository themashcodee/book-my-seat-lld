// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { messages } from "@/constants"
import { GeneralResponse } from "@/types/general"
import { parseUser, User } from "@/types/user"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError } from "zod"
import { db } from "@/configs"
import { generateToken, setCookie } from "@/helpers"

type ResponseData = GeneralResponse

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	console.log("BODY", req.body)

	if (req.method !== "POST")
		return res.status(405).json({
			success: false,
			code: 405,
			error: messages.error.method_not_allowed,
		})

	try {
		parseUser(req.body)
	} catch (err) {
		const error = err as ZodError<User>
		console.log("ERROR PARSING USER", error)
		if (error.issues.length > 0) {
			return res
				.status(400)
				.json({ success: false, code: 400, error: messages.error.bad_request })
		}
	}

	const payload_user = req.body as User

	try {
		let user = await db.user.findUnique({
			where: {
				email: payload_user.email,
			},
		})

		if (!user) {
			const created_user = await db.user.create({
				data: payload_user,
			})

			user = created_user
		}

		if (user.password !== payload_user.password) {
			return res.status(400).json({
				success: false,
				code: 400,
				error: "Provided password is incorrect for this email.",
			})
		}

		const token = await generateToken({
			name: user.name,
			email: user.email,
			password: user.password,
		})

		console.log("TOKEN", token)

		setCookie(res, "auth_token", token, {
			httpOnly: true,
			secure: true,
			maxAge: 30 * 24 * 60 * 60,
			sameSite: "strict",
			path: "/",
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		})

		res.status(200).json({ success: true, code: 200, data: undefined })
	} catch (err) {
		console.log("ERROR CREATING USER", err)

		res.status(500).json({
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		})
	}
}
