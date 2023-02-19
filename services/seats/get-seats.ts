import { GeneralResponse } from "@/types/general"
import { Seat } from "@prisma/client"
import { useQuery } from "react-query"

async function fetchSeats({ movie_id }: Params) {
	const response = await fetch(`/api/seats/list/${movie_id}`)
	const result: GeneralResponse<{ seats: Seat[] }> = await response.json()
	if (!result.success) throw new Error(result.error)
	return result.data.seats
}

type Params = {
	movie_id: number
}

export const useSeats = ({ movie_id }: Params) => {
	const {
		data = [],
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery<Seat[], Error>({
		queryKey: ["get_seats"],
		queryFn: () => fetchSeats({ movie_id }),
		refetchOnWindowFocus: true,
	})

	return {
		seats: data,
		isLoading,
		error: error?.message ?? null,
		refetch,
		isRefetching,
	}
}
