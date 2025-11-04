import { CSSProperties, ReactNode } from "react";

export type BaseProps<P = unknown> = P & {
	extraClasses?: string;
	children?: ReactNode;
	cssStyle?: CSSProperties;
};
