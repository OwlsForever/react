import React from "react";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/utils";

import "./style.scss";

interface Props {
	color?: "lighter" | "darker"; // no color for default
	shadowType?: "inset" | "inset small"/* | "combined"*/;
	fillAvailable?: boolean;
}

// TODO: check if height style works correctly for scrollable content
// TODO: extraClasses (at least padding) should be applied correctly to "combined"
function Panel(props: BaseProps<Props>) {
	const {
		color, shadowType, fillAvailable,
		children, extraClasses, cssStyle,
	} = props;
	const isScrollable = cssStyle?.overflow == "scroll" || cssStyle?.overflow == "auto";
	var classesMain;
	var topPaddingClasses: string[] = [];
	if (isScrollable) {
		classesMain = extraClasses?.split(" ").map(e => {
			if (/p\d+/.test(e)) {
				const size = e.replace("p", "");
				topPaddingClasses.push(`pt${size}`);
				return `pb${size} plr${size}`;
			} else if (/ptb\d+/.test(e)) {
				const size = e.replace("ptb", "");
				topPaddingClasses.push(`pt${size}`);
				return `pb${size}`;
			} else if (/pt\d+/.test(e)) {
				topPaddingClasses.push(e);
				return "";
			}
			return e;
		}).join(" ");
	} else {
		classesMain = extraClasses;
	}

	return <div
		className={makeClassName([
			"panel-component",
			color,
			shadowType,
			isScrollable ? topPaddingClasses.join(" ") : classesMain,
		])}
		style={{ ...(isScrollable ? { overflow: "hidden", display: "flex" } : cssStyle), ...(fillAvailable ? { flex: 1 } : {}) }}
	>
		{isScrollable ? <div className={classesMain} style={{ ...cssStyle, flex: 1 }}>{children}</div> : children}
	</div>
}

export default Panel;
