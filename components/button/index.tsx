import React, { MouseEvent } from "react";
import { IconType } from "../../src/types/icon";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";
import Icon from "../icon";

import "./style.scss";

type Props = {
	// TODO: rework arrows, they works only with two fixed sizes (normal && small), maybe it's possible by using css var or useEffect
	arrow?: "left" | "right" | "both";
	color?: "green" | "red";
	href?: string;
	onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void;
	disabled?: boolean;
	small?: boolean;
} & ({
	text: string;
	iconLeft?: IconType;
	iconRight?: IconType;
	icon?: never;
} | {
	text?: never;
	iconLeft?: never;
	iconRight?: never;
	icon: IconType;
})

function Button(props: BaseProps<Props>) {
	const { extraClasses, arrow, color, disabled, small, href, iconLeft, icon, iconRight, onClick, text } = props;

	return <a
		className={
			makeClassName([
				"button-component",
				extraClasses,
				`arrow-${arrow}`,
				`color-${color}`,
				disabled ? "disabled" : "",
				small ? "small" : "",
				icon ? "icon-only" : "",
			])
		}
		href={disabled ? undefined : (href)}
		onClick={disabled ? undefined : onClick}
	>
		{icon ?
			<Icon icon={icon} small={small} /> :
			<>
				{iconLeft ? <Icon icon={iconLeft} small={small} extraClasses="mr10" /> : ""}
				{text ?? ""}
				{iconRight ? <Icon icon={iconRight} small={small} extraClasses="ml10" /> : ""}
			</>
		}
	</a>
}

export default Button;