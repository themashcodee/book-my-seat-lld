import React from "react"
import { Movie } from "@prisma/client"
import { Head, Loader } from "@/components/core"
import { CheckoutView, MovieNotFound } from "@/components/pages/movie"
import { GetStaticPaths, GetStaticProps } from "next"
import { getDB } from "@/configs"

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

	if (props.not_found) return <MovieNotFound />

	return (
		<>
			<Head />
			<CheckoutView movie={props.movie} />
		</>
	)
}

export default BookTicket

export const getStaticPaths: GetStaticPaths = async () => {
	const { db, disconnect } = await getDB()
	const movies = await db.movie.findMany()
	await disconnect()

	return {
		paths: movies.map((movie) => {
			return { params: { id: movie.id.toString() } }
		}),
		fallback: "blocking",
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

	const { db, disconnect } = await getDB()

	const movie = await db.movie.findUnique({
		where: {
			id: Number(id),
		},
	})

	await disconnect()

	if (!movie) {
		return {
			props: {
				not_found: true,
				movie: null,
			},
		}
	}

	return {
		props: {
			movie: movie,
			not_found: false,
			// revalidate in 1 day (values in seconds)
			revalidate: 60 * 60 * 24,
		},
	}
}
