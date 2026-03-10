export const idfn = (e: any) => e;
export const s2i = (e: string) => +e;

export const makeClassName = (input: ({ val: any | undefined, fn?: (e: any) => string } | string | undefined)[]) => input
	.map(e => typeof e == "string" || e === undefined ? e ?? "" : e.fn ? e.fn(e.val) : (e.val ?? ""))
	.filter(e => e !== "")
	.join(" ");

export const stringCompare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
