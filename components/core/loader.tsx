import React from "react"

type Props = {
	size?: number
	color?: string
}

export const Loader = (props: Props) => {
	const { size = 60, color = "currentColor" } = props

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
						strokeLinecap: "round",
						animation: "loader_dash 1.5s ease-in-out infinite",
					}}
					cx={50}
					cy={50}
					r={20}
					fill="none"
					strokeWidth={2}
					strokeMiterlimit={10}
					stroke={color}
				/>
			</svg>
		</div>
	)
}
