// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { messages } from "@/constants"
import { GeneralResponse } from "@/types/general"
import { User } from "@/types/user"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"
import { getDB } from "@/configs"
import { verifyToken } from "@/helpers"

type ResponseData = GeneralResponse

const RequestData = z.object({
	seats: z.array(z.number()),
	movie_id: z.number(),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method !== "POST")
		return res.status(405).json({
			success: false,
			code: 405,
			error: messages.error.method_not_allowed,
		})

	try {
		RequestData.parse(req.body)
	} catch (err) {
		const error = err as ZodError<User>
		console.log("ERROR PARSING BOOK SEATS API BODY", error)
		if (error.issues.length > 0) {
			return res
				.status(400)
				.json({ success: false, code: 400, error: messages.error.bad_request })
		}
	}

	const seats_ids = req.body.seats as number[]
	const movie_id = req.body.movie_id as number

	console.log({ seats_ids }, "in book")

	if (seats_ids.length > 10) {
		return res.status(400).json({
			success: false,
			code: 400,
			error: "You can only book 10 seats at a time",
		})
	}

	if (seats_ids.length < 1) {
		return res.status(400).json({
			success: false,
			code: 400,
			error: messages.error.movie.no_seats_to_book,
		})
	}

	try {
		const { db, disconnect } = await getDB()
		const movie = await db.movie.findUnique({
			where: {
				id: movie_id,
			},
		})

		if (!movie) {
			await disconnect()

			return res.status(404).json({
				success: false,
				code: 404,
				error: "Movie not found",
				description: messages.error.movie.not_found_to_book_seats,
			})
		}

		const result = await verifyToken(req.cookies.auth_token ?? "")
		const user_email = result.payload.email as string

		const user = await db.user.findUnique({
			where: {
				email: user_email,
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

		const seats = await db.seat.findMany({
			where: {
				movie_id,
				id: {
					in: seats_ids,
				},
				blocked_by_id: user.id,
				availability_type: "blocked",
			},
		})

		if (seats.length === 0) {
			await disconnect()

			return res.status(404).json({
				success: false,
				code: 404,
				error: messages.error.movie.seats_already_booked,
			})
		}

		await db.seat.updateMany({
			where: {
				id: {
					in: seats_ids,
				},
			},
			data: {
				availability_type: "booked",
				booked_at: new Date(),
				booked_by_id: user.id,
			},
		})

		res.status(200).json({ success: true, code: 200, data: undefined })

		await disconnect()
	} catch (err) {
		console.log("ERROR BOOKING SEATS", err)

		res.status(500).json({
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		})
	}
}
