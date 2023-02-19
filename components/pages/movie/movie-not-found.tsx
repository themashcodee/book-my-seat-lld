import Link from "next/link"
import React from "react"

export const MovieNotFound = () => {
	return (
		<div className="w-full h-screen flex items-center justify-center flex-col gap-6 p-6 bg-dark-100">
			<div className="flex flex-col gap-2 items-center text-center">
				<h1 className="text-2xl font-medium max-w-md">
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
