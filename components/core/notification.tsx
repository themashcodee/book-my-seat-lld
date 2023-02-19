import React from "react"
import { toast } from "react-hot-toast"

type Params = {
	type: "success" | "error"
	title: string
	description?: string
}

export const notification = (params: Params) => {
	const { type, title, description } = params

	if (type === "success") {
		toast.success(
			<div className="flex select-none flex-col gap-1">
				<p className="text-sm font-semibold">{title}</p>
				{description && <p className="text-xs">{description}</p>}
			</div>
		)
	} else {
		toast.error(
			<div className="select-none flex flex-col gap-1">
				<p className="text-sm font-semibold">{title}</p>
				{description && <p className="text-xs">{description}</p>}
			</div>
		)
	}
}
