import { queryClient } from "@/configs"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Toaster } from "react-hot-toast"
import { QueryClientProvider } from "react-query"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster
				position="top-right"
				toastOptions={{
					className: "!bg-dark-300 !text-white",
				}}
			/>
			<Component {...pageProps} />
		</QueryClientProvider>
	)
}
