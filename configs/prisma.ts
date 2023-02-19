import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"

export const getDB = async () => {
	const db = new PrismaClient()
	await db.$connect()

	const connection_id = nanoid()

	console.info(
		`NEW CONNECTION ${new Date().toISOString()} with ID ${connection_id}`
	)

	async function disconnect() {
		await db.$disconnect()
		console.info(
			`DISCONNECTED ${new Date().toISOString()} with ID ${connection_id}`
		)
	}

	return {
		db,
		disconnect,
	}
}
