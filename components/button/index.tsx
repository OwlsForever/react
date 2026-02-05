import React, { MouseEvent } from "react";
import { IconType } from "../../src/types/icon";
import { BasePropsNoChildren } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";
import Icon from "../icon";

import "./style.scss";

type Props = {
	// TODO: rework arrows, they works only with two fixed sizes (normal && small), maybe it's possible by using css var or useEffect
	arrow?: "left" | "right" | "both";
	// TODO: add yellow and blue?
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

function Button(props: BasePropsNoChildren<Props>) {
	const {
		arrow, color, disabled, small, href,
		icon, iconLeft, iconRight, text,
		onClick,
		extraClasses, cssStyle,
	} = props;

	return <a
		className={
			makeClassName([
				"button-component",
				extraClasses,
				arrow ? `arrow-${arrow}` : "",
				color ? `color-${color}` : "",
				disabled ? "disabled" : "",
				small ? "small" : "",
				icon ? "icon-only" : "",
			])
		}
		style={cssStyle}
		href={disabled ? undefined : (href)}
		onClick={disabled ? undefined : onClick}
	>
		{icon ?
			<Icon icon={icon} cssStyle={icon.style} small={small} /> :
			<>
				{iconLeft ? <Icon icon={iconLeft} cssStyle={iconLeft.style} small={small} extraClasses="mr12" /> : ""}
				{text ?? ""}
				{iconRight ? <Icon icon={iconRight} cssStyle={iconRight.style} small={small} extraClasses="ml12" /> : ""}
			</>
		}
	</a>
}

export default Button;