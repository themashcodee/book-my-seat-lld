import { Head } from "@/components/core"
import { db } from "@/configs"
import { Movie } from "@prisma/client"
import { GetStaticPropsContext } from "next"
import Image from "next/image"
import Link from "next/link"

type Props = {
	movies: Movie[]
}

export default function Home({ movies }: Props) {
	return (
		<>
			<Head />
			<main className="p-12 w-full h-screen flex items-center justify-center">
				<div className="flex flex-col gap-12 items-center">
					<h1 className="text-6xl font-bold">Movies</h1>
					<div className="flex items-center gap-4">
						{movies.map((movie) => {
							return (
								<div
									key={movie.id}
									className="rounded-lg overflow-hidden border w-80 relative aspect-[2/3] flex items-end"
								>
									<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-900 z-1"></div>
									<Image
										src={movie.poster}
										alt={movie.name}
										className="w-full absolute h-full object-cover z-[-1]"
										width={200}
										height={300}
									/>
									<div className="p-5 flex flex-col gap-6 mt-auto z-[2] text-white w-full">
										<h2 className="text-4xl font-semibold flex items-end gap-2">
											<span>{movie.name}</span>
											<span className="text-xs text-gray-400 mb-1">
												({movie.year})
											</span>
										</h2>

										<Link href={`/movie/${movie.id}`} passHref>
											<button
												tabIndex={-1}
												className="bg-red-500 text-white font-medium px-4 py-2 rounded-md w-full"
											>
												Book Now
											</button>
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</main>
		</>
	)
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const movies = await db.movie.findMany()

	return {
		props: {
			movies,
		},
	}
}
