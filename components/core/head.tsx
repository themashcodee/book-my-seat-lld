import React from "react"
import NextHead from "next/head"

type Props = {
	title?: string
}

export const Head = ({ title }: Props) => {
	return (
		<NextHead>
			<title>{title ? `Book My Ticker | ${title}` : `Book My Ticket`}</title>
			<meta name="description" content="Book My Ticket LLD (Partially)" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.png" />
		</NextHead>
	)
}
