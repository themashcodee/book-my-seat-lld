import React from "react"
import { Seat } from "@prisma/client"
import { SeatPreview } from "./seat-preview"

type Props = {
	seats: Seat[]
	seats_per_row: number
	selectedSeats: number[]
}

export const SeatsPreview = (props: Props) => {
	const { seats, seats_per_row, selectedSeats } = props

	return (
		<div className="w-full max-w-max bg-dark-200 rounded-lg p-6 overflow-auto flex">
			<div
				className="grid gap-3 max-w-max"
				style={{
					gridTemplateColumns: `repeat(${seats_per_row}, 1fr)`,
				}}
			>
				{seats.map((seat) => {
					return (
						<SeatPreview
							key={seat.id}
							seat={seat}
							selected={selectedSeats.includes(seat.id)}
						/>
					)
				})}
			</div>
		</div>
	)
}
