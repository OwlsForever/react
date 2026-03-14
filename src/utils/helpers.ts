import { Dispatch, SetStateAction, useState } from "react";

export const idfn = (e: any) => e;
export const s2i = (e: string) => +e;

export const makeClassName = (input: ({ val: any | undefined, fn?: (e: any) => string } | string | undefined)[]) => input
	.map(e => typeof e == "string" || e === undefined ? e ?? "" : e.fn ? e.fn(e.val) : (e.val ?? ""))
	.filter(e => e !== "")
	.join(" ");

export const stringCompare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

const url = new URL(window.location.href);
const params = url.searchParams;

export const useStateWithURLParams = <T>(defaultValue: T, paramName: string, s2v: (param: string) => T = idfn, v2s: (param: T) => string = idfn): [T, Dispatch<SetStateAction<T>>] => {
	const param = params.get(paramName);
	const [value, setValue] = useState(param !== null ? s2v(param) : defaultValue);
	const customSetValue = (e: SetStateAction<T>) => {
		setValue(e);
		const newValue = v2s(e instanceof Function ? e(value) : e);
		params.set(paramName, newValue);
		history.pushState({}, "", url.href);
	};
	return [value, customSetValue];
}
