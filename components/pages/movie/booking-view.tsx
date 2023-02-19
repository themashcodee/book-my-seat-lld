import React, { useCallback, useEffect, useState } from "react"
import { Movie, Seat } from "@prisma/client"
import { ArrowRoundBack, StarHalfSharp, StarSharp } from "@/components/icons"
import Link from "next/link"
import { Seats } from "./seats"
import { Loader, notification } from "@/components/core"
import { block_seats, useSeats } from "@/services"
import { useRouter } from "next/router"

type Props = {
	movie: Movie
}

export const BookingView = (props: Props) => {
	const { movie } = props
	const router = useRouter()
	const rating_star = Math.floor(movie.rating)
	const rating_decimal = movie.rating - rating_star
	const [isBlockingSeats, setIsBlockingSeats] = useState(false)
	const [selectedSeats, setSelectedSeats] = useState<number[]>([])
	const { seats, isLoading, error, refetch } = useSeats({ movie_id: movie.id })

	const handleProceedToCheckout = useCallback(async () => {
		if (selectedSeats.length === 0) {
			return notification({
				type: "error",
				title: "You have not selected any seats.",
				description: "You can select seats by clicking on them.",
			})
		}

		if (selectedSeats.length > 10) {
			return notification({
				type: "error",
				title: "You can only select up to 10 seats.",
			})
		}

		setIsBlockingSeats(true)
		const data = await block_seats({
			movie_id: movie.id,
			seats: selectedSeats,
		})
		setIsBlockingSeats(false)

		if (!data.success) {
			notification({
				type: "error",
				title: data.error,
				description: data.description,
			})
			setSelectedSeats([])

			if (data.type === "seats_unavailable") refetch()

			return
		}

		setSelectedSeats([])

		router.push(`/checkout/${movie.id}`)
	}, [selectedSeats, movie.id, refetch, router])

	useEffect(() => {
		if (error) {
			notification({
				type: "error",
				title: "An error occurred while fetching seats.",
				description: error,
			})
		}
	}, [error])

	return (
		<div className="w-full min-h-screen overflow-auto p-6 sm:p-12 bg-dark-100 relative z-[1]">
			<div
				className="w-[100%] h-80 bg-white absolute left-0 top-0 z-[-1]"
				style={{
					background:
						"radial-gradient(ellipse at top, hsla(236, 87%, 59%,.1) 0%, #0d1116 50%)",
				}}
			></div>

			<div className="flex flex-col gap-12 z-[1]">
				<header className="flex items-center">
					<Link className="items-center gap-2 text-sm flex" href="/">
						<ArrowRoundBack size={26} />
						<span>Back to movies</span>
					</Link>
				</header>

				<section className="flex flex-col gap-8 items-center w-full">
					<div className="flex flex-col items-center gap-3">
						<div className="flex items-center gap-1 text-yellow-400">
							{Array.from({ length: rating_star }).map((_, i) => {
								return <StarSharp key={i} size={20} />
							})}
							{rating_decimal > 0 && <StarHalfSharp size={20} />}
						</div>
						<h1 className="font-bold text-4xl">{movie.name}</h1>
						<p className="font-medium">({movie.year})</p>
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

					{seats.length > 0 && (
						<div className="flex flex-col gap-2 overflow-hidden w-full items-center">
							<Seats
								seats={seats}
								seats_per_row={movie.seats_per_row}
								selectedSeats={selectedSeats}
								setSelectedSeats={setSelectedSeats}
							/>
							<p className="italic text-[10px] leading-[10px] sm:text-xs text-dark-300 text-center md:hidden">
								Scroll to right to see more seats. Click on a seat to select it.
							</p>
						</div>
					)}

					{seats.length > 0 && (
						<div className="w-full flex justify-center">
							<button
								disabled={isBlockingSeats}
								className="w-full max-w-[240px] h-10 md:h-12 rounded-md bg-primary px-4 flex items-center gap-2 justify-center"
								onClick={() => {
									handleProceedToCheckout()
								}}
							>
								{!isBlockingSeats && <span>Proceed to checkout</span>}
								{isBlockingSeats && <Loader size={16} />}
								{isBlockingSeats && <span>Confirming seats</span>}
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	)
}
