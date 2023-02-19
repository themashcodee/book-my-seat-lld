// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { messages } from "@/constants"
import { GeneralResponse } from "@/types/general"
import type { NextApiRequest, NextApiResponse } from "next"
import { getDB } from "@/configs"
import { Seat } from "@prisma/client"

type ResponseData = GeneralResponse<{
	seats: Seat[]
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

	const id = req.query.id as string
	const movie_id = parseInt(id)

	if (isNaN(movie_id)) {
		return res
			.status(400)
			.json({ success: false, code: 400, error: messages.error.bad_request })
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

		const seats = await db.seat.findMany({
			where: {
				movie_id,
			},
			orderBy: {
				id: "asc",
			},
		})

		res.status(200).json({
			success: true,
			code: 200,
			data: {
				seats,
			},
		})

		await disconnect()
	} catch (err) {
		console.log("ERROR FETCHING SEATS", err)

		res.status(500).json({
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		})
	}
}
