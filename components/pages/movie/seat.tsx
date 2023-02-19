import React, { memo, useMemo } from "react"
import { Seat } from "@prisma/client"
import { Cross, Crown, Handicap } from "@/components/icons"
import { isBlockingExpired } from "@/helpers"

type Props = {
	seat: Seat
	selected: boolean
	onChange: (seat: Seat, selected: boolean) => void
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
		styles: "bg-dark-300 text-gray-500 cursor-not-allowed",
	},
	booked: {
		styles: "bg-dark-300 text-gray-500 cursor-not-allowed",
	},
	empty: {
		styles: "opacity-0 bg-transparent cursor-default",
	},
}

export const SeatBlock = memo((props: Props) => {
	const { seat, selected, onChange } = props
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
			className={`h-6 w-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center bg-primary-100 text-white text-[8px] leading-[8px] sm:text-[10px] sm:leading-[10px] lg:text-xs lg:leading-4 relative ${
				data.styles
			} ${selected ? "!bg-green-600" : ""}`}
			onClick={() => onChange(seat, !selected)}
		>
			{seat_type === "vip" && status === "available" && (
				<span className="absolute text-yellow-400 -right-1 -top-1.5">
					<Crown />
				</span>
			)}

			{seat_type !== "handicapped" && status === "available" && seat.name}

			{seat_type === "handicapped" && status === "available" && (
				<span className="text-lime-400">
					<Handicap size={20} />
				</span>
			)}

			{(status === "booked" || status === "blocked") && <Cross />}
		</button>
	)
})

SeatBlock.displayName = "SeatBlock"
