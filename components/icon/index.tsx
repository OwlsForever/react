import React from "react";
import { IconType } from "../../src/types/icon";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";

import "./style.scss";

type Props = {
	icon: IconType;
	small?: boolean;
}

// TODO: move IconType here?

const makeIconName = ({ name, type, animation, rotation, flip }: IconType) => {
	const faCssPrefix = "fa";

	return [
		`${faCssPrefix}${type[0]} ${faCssPrefix}-${name}`,
		animation !== undefined ? `${faCssPrefix}-${animation}` : "",
		rotation !== undefined ? `${faCssPrefix}-rotate-${rotation}` : "",
		flip !== undefined ? `${faCssPrefix}-flip-${flip}` : "",
	].filter(e => e !== "").join(" ")
}

function Icon(props: BaseProps<Props>) {
	const { extraClasses, cssStyle, icon, small } = props;

	return <i
		className={
			makeClassName([
				"icon-component",
				makeIconName(icon),
				small ? "small" : "",
				extraClasses,
			])
		}
		style={cssStyle}
	/>
}

export default Icon;