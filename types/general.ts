export type GeneralResponse<Data = void> =
	| {
			success: true
			code: number
			message?: string
			data: Data
	  }
	| {
			success: false
			error: string
			description?: string
			type?: string
			code: number
	  }

export type GeneralAsyncResponse<Data = void> = Promise<GeneralResponse<Data>>
