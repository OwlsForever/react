import React from "react";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";

import "./style.scss";

interface Props {
	color?: "lighter" | "darker";
	shadowType?: "inset" | "inset small" | "combined";
}

// TODO: extraClasses (at least padding) should be applied correctly to "combined"
function Panel(props: BaseProps<Props>) {
	const { extraClasses, children, cssStyle, color, shadowType } = props;
	return <div
		className={makeClassName([
			"panel-component",
			color,
			shadowType,
			extraClasses,
		])}
		style={cssStyle ?? {}}
	>
		{shadowType == "combined" ? <div>{children}</div> : children}
	</div>
}

export default Panel;
