import React, { memo } from "react"
import { Seat } from "@prisma/client"
import { Cross, Crown, Handicap } from "@/components/icons"

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
		styles: "bg-dark-300 text-gray-500 cursor-not-allowed",
	},
	booked: {
		styles: "bg-dark-300 text-gray-500 cursor-not-allowed",
	},
	empty: {
		styles: "opacity-0 bg-transparent cursor-default",
	},
}

export const SeatPreview = memo((props: Props) => {
	const { seat, selected } = props
	const data = statusToData[seat.availability_type]

	return (
		<button
			className={`h-6 w-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center bg-primary-100 text-white text-[8px] leading-[8px] sm:text-[10px] sm:leading-[10px] lg:text-xs lg:leading-4 relative ${
				data.styles
			} ${selected ? "!bg-green-600 !text-white" : ""}`}
		>
			{seat.seat_type === "vip" && seat.availability_type === "available" && (
				<span className="absolute text-yellow-400 -right-1 -top-1.5">
					<Crown />
				</span>
			)}

			{seat.seat_type === "vip" &&
				seat.availability_type === "available" &&
				seat.name}

			{seat.availability_type === "available" &&
				seat.seat_type === "handicapped" && (
					<span className="text-lime-400">
						<Handicap size={20} />
					</span>
				)}

			{seat.availability_type === "available" &&
				seat.seat_type === "normal" &&
				seat.name}

			{seat.availability_type === "booked" && <Cross />}
			{seat.availability_type === "blocked" && !selected && <Cross />}
			{seat.availability_type === "blocked" && selected && seat.name}
		</button>
	)
})

SeatPreview.displayName = "SeatBlock"
