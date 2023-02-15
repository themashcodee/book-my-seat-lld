import { login } from "@/services/user"
import { parseUser, User } from "@/types/user"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { ZodError } from "zod"

export const LoginForm = () => {
	const router = useRouter()
	const [data, setData] = useState({
		loading: false,
		email: {
			value: "",
			error: "",
		},
		password: {
			value: "",
			error: "",
		},
	})

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			const user = parseUser({
				name: data.email.value.split("@")[0],
				email: data.email.value,
				password: data.password.value,
			})

			setData((prev) => {
				return {
					...prev,
					loading: true,
				}
			})

			const response = await login(user)

			setData((prev) => {
				return {
					...prev,
					loading: false,
				}
			})

			if (!response.success) {
				return toast.error(response.error)
			}

			router.push("/")
		} catch (err) {
			const error = err as ZodError<User>
			error.errors.forEach((e) => {
				const field = e.path[0] as keyof User
				if (field === "name") return
				setData((prev) => ({
					...prev,
					[field]: { ...prev[field], error: e.message },
				}))
			})
		}
	}

	return (
		<form
			className="flex flex-col gap-4 w-full max-w-lg"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-medium">
					Your email <span className="text-red-500">*</span>
				</label>
				<input
					type="email"
					name="email"
					id="email"
					value={data.email.value}
					onChange={(e) =>
						setData({
							...data,
							email: {
								value: e.target.value,
								error: "",
							},
						})
					}
					className="p-4 border rounded"
					placeholder="name@company.com"
					required
				/>
				{data.email.error && (
					<span className="text-red-400 text-sm">{data.email.error}</span>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password" className="text-sm font-medium">
					Password <span className="text-red-500">*</span>
				</label>
				<input
					type="password"
					name="password"
					id="password"
					value={data.password.value}
					onChange={(e) =>
						setData({
							...data,
							password: {
								value: e.target.value,
								error: "",
							},
						})
					}
					placeholder="••••••••"
					className="p-4 border rounded"
					required
				/>
				{data.password.error && (
					<span className="text-red-400 text-sm">{data.password.error}</span>
				)}
			</div>
			<button
				disabled={data.loading}
				type="submit"
				className={`bg-blue-500 text-white p-4 rounded-md font-medium ${
					data.loading ? "opacity-50 cursor-not-allowed" : ""
				}`}
			>
				{"Let's Go"}
			</button>
		</form>
	)
}
