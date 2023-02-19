import { messages } from "@/constants"
import { GeneralAsyncResponse, GeneralResponse } from "@/types/general"

type Input = {
	seats: number[]
	movie_id: number
}

export const book_seats = async (input: Input): GeneralAsyncResponse => {
	try {
		const response = await fetch("/api/seats/book", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		})
		const data: GeneralResponse = await response.json()
		return data
	} catch (err) {
		console.log("ERROR IN BOOK SEATS API REQUEST", err)

		return {
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		}
	}
}
