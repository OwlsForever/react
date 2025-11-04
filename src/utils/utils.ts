export const makeClassName = (input: ({ val: any | undefined, fn?: (e: any) => string } | string | undefined)[]) => input
	.map(e => typeof e == "string" || e === undefined ? e ?? "" : e.fn ? e.fn(e.val) : (e.val ?? ""))
	.filter(e => e !== "")
	.join(" ");
