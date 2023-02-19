// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { messages } from "@/constants"
import { GeneralResponse } from "@/types/general"
import { User } from "@/types/user"
import type { NextApiRequest, NextApiResponse } from "next"
import { getDB } from "@/configs"
import { verifyToken } from "@/helpers"
import { Seat } from "@prisma/client"

type ResponseData = GeneralResponse<{
	user: Omit<User, "password"> & {
		blocked_seats: Seat[]
		booked_seats: Seat[]
	}
}>

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method !== "GET")
		return res.status(405).json({
			success: false,
			code: 405,
			error: messages.error.method_not_allowed,
		})

	try {
		const { db, disconnect } = await getDB()

		const result = await verifyToken(req.cookies.auth_token ?? "")
		const user_email = result.payload.email as string

		const user = await db.user.findUnique({
			where: {
				email: user_email,
			},
			select: {
				id: true,
				email: true,
				name: true,
				blocked_seats: true,
				booked_seats: true,
			},
		})

		if (!user) {
			await disconnect()

			return res.status(404).json({
				success: false,
				code: 404,
				error: "User not found",
				description: messages.error.user.not_found,
			})
		}

		res.status(200).json({
			success: true,
			code: 200,
			data: {
				user,
			},
		})

		await disconnect()
	} catch (err) {
		console.log("ERROR FETCHING USER", err)

		res.status(500).json({
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		})
	}
}
