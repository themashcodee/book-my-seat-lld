import { messages } from "@/constants"
import { GeneralAsyncResponse, GeneralResponse } from "@/types/general"
import { User } from "@/types/user"

type Input = User

export const login = async (input: Input): GeneralAsyncResponse => {
	try {
		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		})
		const data: GeneralResponse = await response.json()
		return data
	} catch (err) {
		console.log("ERROR IN LOGIN SERVICE", err)

		return {
			success: false,
			code: 500,
			error: messages.error.internal_server_error,
		}
	}
}
