import React from "react"
import NextHead from "next/head"

type Props = {
	title?: string
}

export const Head = ({ title }: Props) => {
	return (
		<NextHead>
			<title>{title ? `Book My Seat | ${title}` : `Book My Seat`}</title>
			<meta name="description" content="Book My Seat LLD (Partially)" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" />
		</NextHead>
	)
}
