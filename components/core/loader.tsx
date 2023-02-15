import React from "react"

type Props = {
	size?: number
}

export const Loader = (props: Props) => {
	const { size = 100 } = props

	const containerStyle = {
		width: size,
		height: size,
	}

	return (
		<div style={containerStyle}>
			<svg
				className="animate-spin relative w-full h-full"
				viewBox="25 25 50 50"
			>
				<circle
					style={{
						strokeDasharray: "1,200",
						strokeDashoffset: 0,
						animation:
							"loader_dash 1.5s ease-in-out infinite, loader_color 6s ease-in-out infinite",
						strokeLinecap: "round",
					}}
					cx={50}
					cy={50}
					r={20}
					fill="none"
					strokeWidth={2}
					strokeMiterlimit={10}
				/>
			</svg>
		</div>
	)
}
