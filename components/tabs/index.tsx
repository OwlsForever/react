import React, { useState } from "react";
import { BasePropsNoChildren } from "../../src/types/base";
import { IconType } from "../../src/types/icon";
import Icon from "../icon";
import { makeClassName } from "../../src/utils/utils";
import Panel from "../panel";

import "./style.scss";

interface Props {
	tabs: {
		[key: string]: {
			title: string;
			icon?: IconType;
			body: React.ReactNode;
			visible?: boolean;
		}
	}
	startTab?: string;
	fillAvailable?: boolean;
	panelExtraClasses?: string;
	panelStyle?: React.CSSProperties;
}

function Tabs(props: BasePropsNoChildren<Props>) {
	const {
		tabs, startTab, fillAvailable,
		panelExtraClasses, panelStyle,
		extraClasses, cssStyle
	} = props;
	const [currentTab, setCurrentTab] = useState(startTab ?? (Object.keys(tabs)[0] || ""));
	return <div
		className={
			makeClassName([
				"tabs-component",
				extraClasses,
			])
		}
		style={fillAvailable ? { ...cssStyle } : cssStyle}
	>
		<ul className="tabs">
			{Object.entries(tabs).filter(([_, tab]) => tab.visible ?? true).map(([tabName, tab]) =>
				<li key={tabName}>
					<a className={`tab ${currentTab == tabName ? "active" : ""}`} onClick={() => { setCurrentTab(tabName) }} >
						{tab.icon ? <Icon icon={tab.icon} /> : ""}{tab.title}
					</a>
				</li>
			)}
		</ul>
		<Panel fillAvailable extraClasses={panelExtraClasses} cssStyle={panelStyle}>
			{tabs[currentTab] ? tabs[currentTab].body : ""}
		</Panel>
	</div>
}

export default Tabs;