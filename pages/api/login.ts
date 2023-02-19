// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { messages } from "@/constants"
import { GeneralResponse } from "@/types/general"
import { parseUser, User } from "@/types/user"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError } from "zod"
import { getDB } from "@/configs"
import { generateToken, setCookie } from "@/helpers"
import bcrypt from "bcryptjs"

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
		const { db, disconnect } = await getDB()
		let user = await db.user.findUnique({
			where: {
				email: payload_user.email,
			},
		})

		if (!user) {
			const salt = bcrypt.genSaltSync(10)
			const hash = bcrypt.hashSync(payload_user.password, salt)
			const created_user = await db.user.create({
				data: {
					email: payload_user.email,
					name: payload_user.name,
					password: hash,
				},
			})

			user = created_user
		}

		const is_password_correct = bcrypt.compareSync(
			payload_user.password,
			user.password
		)
		if (!is_password_correct) {
			await disconnect()

			return res.status(400).json({
				success: false,
				code: 400,
				error: messages.error.user.incorrect_password,
			})
		}

		const token = await generateToken({
			name: user.name,
			email: user.email,
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

		await disconnect()
	} catch (err) {
		console.log("ERROR CREATING USER", err)

		res.status(500).json({
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		})
	}
}
