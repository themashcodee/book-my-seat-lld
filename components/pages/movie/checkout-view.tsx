import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Movie } from "@prisma/client"
import { ArrowRoundBack } from "@/components/icons"
import { Loader, notification } from "@/components/core"
import { cancel_seats, useSeats, useUser } from "@/services"
import { useRouter } from "next/router"
import { SeatsPreview } from "./seats-preview"
import { Modal } from "@mantine/core"
import { messages } from "@/constants"

type Props = {
	movie: Movie
}

export const CheckoutView = (props: Props) => {
	const { movie } = props
	const router = useRouter()
	const [isBookingSeats, setIsBookingSeats] = useState(false)
	const { seats, isLoading, error } = useSeats({ movie_id: movie.id })
	const [openPreview, setOpenPreview] = useState(false)
	const { user, error: userError } = useUser()

	useEffect(() => {
		if (error) {
			notification({
				type: "error",
				title:
					"An error occurred while fetching seats, please try again later.",
				description: error,
			})
			router.push("/")
		}
		if (userError) {
			notification({
				type: "error",
				title: "An error occurred while fetching user, please try again later.",
				description: userError,
			})
			router.push("/")
		}
	}, [error, router, userError])

	const blockedSeats = useMemo(() => {
		if (!user) return []
		if (seats.length === 0) return []

		const filteredSeats = user.blocked_seats.filter(
			(seat) => seat.movie_id === movie.id
		)

		if (filteredSeats.length === 0) {
			notification({
				type: "error",
				title: "Your booking has expired.",
				description: "Please select seats again.",
			})
			router.push(`/movie/${movie.id}`)
		}

		return filteredSeats
	}, [user, seats, movie.id, router])

	const selectedSeats = useMemo(
		() => blockedSeats.map((seat) => seat.id),
		[blockedSeats]
	)

	const handleCancelBooking = useCallback(async () => {
		if (selectedSeats.length === 0) {
			notification({
				type: "error",
				title: "Error cancelling seats",
				description: messages.error.movie.no_seats_to_cancel,
			})
			router.push(`/movie/${movie.id}`)
			return
		}

		const response = await cancel_seats({
			movie_id: movie.id,
			seats: selectedSeats,
		})

		if (!response.success) {
			notification({
				type: "error",
				title: "An error occurred while cancelling your booking.",
				description: response.error,
			})
			return
		}

		notification({
			type: "success",
			title: "Booking cancelled.",
			description: "Your booking has been cancelled.",
		})
		router.push(`/movie/${movie.id}`)
	}, [selectedSeats, movie, router])

	const handleBookSeat = useCallback(async () => {
		//
	}, [])

	if (selectedSeats.length === 0) {
		return (
			<div className="w-full min-h-screen overflow-auto p-6 sm:p-12 bg-dark-100 relative z-[1] flex items-center justify-center">
				<div
					className="w-[100%] h-80 bg-white absolute left-0 top-0 z-[-1]"
					style={{
						background:
							"radial-gradient(ellipse at top, hsla(236, 87%, 59%,.1) 0%, #0d1116 50%)",
					}}
				></div>
				<Loader />
			</div>
		)
	}

	return (
		<div className="w-full min-h-screen overflow-auto p-6 sm:p-12 bg-dark-100 relative z-[1]">
			<div
				className="w-[100%] h-80 bg-white absolute left-0 top-0 z-[-1]"
				style={{
					background:
						"radial-gradient(ellipse at top, hsla(236, 87%, 59%,.1) 0%, #0d1116 50%)",
				}}
			></div>

			<div className="flex flex-col gap-12 z-[1] w-full items-center">
				<header className="flex items-center w-full">
					<button
						className="items-center gap-2 text-sm flex"
						onClick={() => {
							handleCancelBooking()
						}}
					>
						<ArrowRoundBack size={26} />
						<span>Cancel booking</span>
					</button>
				</header>

				<section className="flex flex-col gap-8 w-full max-w-5xl">
					<div className="flex gap-3 items-end">
						<h1 className="font-bold text-4xl">{movie.name}</h1>
						<p className="font-medium text-sm text-white/70">({movie.year})</p>
					</div>

					{isLoading && seats.length === 0 && (
						<div className="flex items-center justify-center h-80">
							<Loader color="hsla(236, 87%, 59%,1)" />
						</div>
					)}

					{!isLoading && seats.length === 0 && (
						<div className="flex items-center justify-center h-80">
							<p>No seats available for this movie. Please try again later.</p>
						</div>
					)}

					<Modal
						opened={openPreview}
						onClose={() => setOpenPreview(false)}
						closeOnClickOutside
					>
						{seats.length > 0 && (
							<div className="flex flex-col gap-2 overflow-hidden">
								<SeatsPreview
									selectedSeats={selectedSeats}
									seats={seats}
									seats_per_row={movie.seats_per_row}
								/>
								<p className="italic text-[10px] leading-[10px] sm:text-xs text-dark-300 text-center md:hidden">
									Scroll to right to see more seats. Click on a seat to select
									it.
								</p>
							</div>
						)}
					</Modal>

					{seats.length > 0 && (
						<div className="w-full flex justify-center">
							<button
								disabled={isBookingSeats}
								className="w-full max-w-[240px] h-10 md:h-12 rounded-md bg-primary px-4 flex items-center gap-2 justify-center"
								onClick={() => {
									handleBookSeat()
								}}
							>
								{!isBookingSeats && <span>Book Seats</span>}
								{isBookingSeats && <Loader size={16} />}
								{isBookingSeats && <span>Booking Seats</span>}
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	)
}