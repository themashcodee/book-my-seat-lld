import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { Movie } from "@prisma/client"
import { db } from "@/configs"
import Link from "next/link"
import { Head, Loader } from "@/components/core"

type Props =
	| {
			movie: Movie
			not_found: false
	  }
	| {
			movie: null
			not_found: true
	  }

const BookTicket = (props: Props) => {
	if (Object.keys(props).length === 0) {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<Loader />
			</div>
		)
	}

	if (props.not_found) {
		return (
			<div className="w-full h-screen flex items-center justify-center flex-col gap-6 p-6">
				<div className="flex flex-col gap-2 items-center text-center">
					<h1 className="text-2xl font-bold max-w-md">
						{
							"Sorry, We Couldn't Find Your Movie. Did You Check the Couch Cushions?"
						}
					</h1>
				</div>
				<Link href="/" passHref>
					<button
						tabIndex={-1}
						className="bg-red-500 text-white font-medium px-4 py-2 text-sm sm:text-base rounded-md w-full"
					>
						Go back to home
					</button>
				</Link>
			</div>
		)
	}

	return (
		<>
			<Head />
			<div className="w-full h-screen overflow-auto">
				<div className="w-full flex p-12">
					<h1 className="font-bold text-2xl">{props.movie.name}</h1>
				</div>
			</div>
		</>
	)
}

export default BookTicket

export const getStaticPaths: GetStaticPaths = async () => {
	const movies = await db.movie.findMany()

	return {
		paths: movies.map((movie) => {
			return { params: { id: movie.id.toString() } }
		}),
		fallback: true,
	}
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
	const id = context.params?.id

	if (typeof id !== "string") {
		return {
			props: {
				not_found: true,
				movie: null,
			},
		}
	}

	const movie = await db.movie.findUnique({
		where: {
			id: parseInt(id),
		},
	})

	if (!movie) {
		return {
			props: {
				not_found: true,
				movie: null,
			},
		}
	}

	return {
		props: { movie, not_found: false },
	}
}
