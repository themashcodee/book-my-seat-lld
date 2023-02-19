import React, { memo, useMemo } from "react"
import { Seat } from "@prisma/client"
import { Cross, Crown, Handicap } from "@/components/icons"
import { isBlockingExpired } from "@/helpers"

type Props = {
	seat: Seat
	selected: boolean
}

const statusToData: {
	[key in Seat["availability_type"]]: {
		styles: string
	}
} = {
	available: {
		styles: "bg-primary text-white",
	},
	blocked: {
		styles: "bg-dark-300 text-gray-500",
	},
	booked: {
		styles: "bg-dark-300 text-gray-500",
	},
	empty: {
		styles: "opacity-0 bg-transparent",
	},
}

export const SeatPreview = memo((props: Props) => {
	const { seat, selected } = props
	const { seat_type, availability_type, blocked_at } = seat

	const status: Seat["availability_type"] = useMemo(() => {
		if (availability_type === "empty") return "empty"
		if (availability_type === "booked") return "booked"
		if (availability_type === "available") return "available"
		if (blocked_at && isBlockingExpired(blocked_at)) return "available"
		return "blocked"
	}, [availability_type, blocked_at])

	const data = statusToData[status]

	return (
		<button
			className={`h-6 w-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center bg-primary-100 text-white text-[8px] leading-[8px] sm:text-[10px] sm:leading-[10px] lg:text-xs lg:leading-4 relative cursor-default ${
				data.styles
			} ${selected ? "!bg-green-600 !text-white" : ""}`}
		>
			{seat.seat_type === "vip" && status === "available" && (
				<span className="absolute text-yellow-400 -right-1 -top-1.5">
					<Crown />
				</span>
			)}

			{seat_type !== "handicapped" && status === "available" && seat.name}

			{seat.seat_type === "handicapped" && status === "available" && (
				<span className="text-lime-400">
					<Handicap size={20} />
				</span>
			)}

			{seat.availability_type === "booked" && <Cross />}
			{seat.availability_type === "blocked" && !selected && <Cross />}
			{seat.availability_type === "blocked" && selected && seat.name}
		</button>
	)
})

SeatPreview.displayName = "SeatBlock"
