import { z } from "zod"

const User = z.object({
	name: z.string(),
	email: z.string().email({
		message: "Email address is invalid",
	}),
	password: z
		.string()
		.min(8, {
			message: "Password must be at least 8 characters long",
		})
		.max(32, {
			message: "Password must be at most 32 characters long",
		}),
})

export type User = z.infer<typeof User>
export const parseUser = (data: unknown) => User.parse(data)
