import React from "react"

type Props = {
	message: string
}

export const DeveloperNote = (props: Props) => {
	const { message } = props

	return (
		<div className="p-4 bg-gray-100 rounded-md text-xs flex flex-col gap-1">
			<span className="text-[10px] leading-[10px] font-bold italic">
				Developer Note:
			</span>
			<span>{message}</span>
		</div>
	)
}
