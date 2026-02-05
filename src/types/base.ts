import { CSSProperties, ReactNode } from "react";

export type BaseProps<P = unknown> = P & {
	extraClasses?: string;
	children?: ReactNode;
	cssStyle?: CSSProperties;
};

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export type BasePropsNoChildren<P = unknown> = P & Without<BaseProps, "children">;
