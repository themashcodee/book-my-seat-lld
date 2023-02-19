import { GeneralResponse } from "@/types/general"
import { Seat, User } from "@prisma/client"
import { useQuery } from "react-query"

type OutputUser = Omit<User, "password"> & {
	blocked_seats: Seat[]
	booked_seats: Seat[]
}

async function fetchUser() {
	const response = await fetch(`/api/user`)
	const result: GeneralResponse<{ user: OutputUser }> = await response.json()
	if (!result.success) throw new Error(result.error)
	return result.data.user
}

export const useUser = () => {
	const { data, isLoading, error, refetch, isRefetching } = useQuery<
		OutputUser,
		Error
	>({
		queryKey: "get_user",
		queryFn: fetchUser,
		retry: 1,
	})

	return {
		user: data,
		isLoading,
		error: error?.message ?? null,
		refetch,
		isRefetching,
	}
}
