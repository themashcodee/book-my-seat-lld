import { isBlockingExpired } from "@/helpers"
import { Seat } from "@prisma/client"
import React, { Dispatch, SetStateAction, useCallback } from "react"
import { SeatBlock } from "./seat"

type Props = {
	seats: Seat[]
	seats_per_row: number
	selectedSeats: number[]
	setSelectedSeats: Dispatch<SetStateAction<number[]>>
}

export const Seats = (props: Props) => {
	const { seats, seats_per_row, selectedSeats, setSelectedSeats } = props

	const handleSeatClick = useCallback(
		(seat: Seat, selected: boolean) => {
			if (seat.availability_type === "blocked" && seat.blocked_at) {
				if (isBlockingExpired(seat.blocked_at)) {
					if (selected) {
						setSelectedSeats((prev) => [...prev, seat.id])
					} else {
						setSelectedSeats((prev) => prev.filter((id) => id !== seat.id))
					}
				}
			}

			if (seat.availability_type === "available") {
				if (selected) {
					setSelectedSeats((prev) => [...prev, seat.id])
				} else {
					setSelectedSeats((prev) => prev.filter((id) => id !== seat.id))
				}
			}
		},
		[setSelectedSeats]
	)

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
						<SeatBlock
							key={seat.id}
							seat={seat}
							selected={selectedSeats.includes(seat.id)}
							onChange={handleSeatClick}
						/>
					)
				})}
			</div>
		</div>
	)
}
