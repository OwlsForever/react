import React, { useState } from "react";
import { BaseProps } from "../../src/types/base";
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
		}
	}
	startTab?: string;
}

function Tabs(props: BaseProps<Props>) {
	const { tabs, startTab, extraClasses } = props;
	const [currentTab, setCurrentTab] = useState(startTab ?? (Object.keys(tabs)[0] || ""));
	return <div className={
		makeClassName([
			"tabs-component flex-column-fill",
			extraClasses,
		])
	}>
		<ul className="tabs">
			{Object.entries(tabs).map(([tabName, tab]) =>
				<li key={tabName}>
					<a className={`tab ${currentTab == tabName ? "active" : ""}`} onClick={() => { setCurrentTab(tabName) }} >
						{tab.icon ? <Icon icon={tab.icon} /> : ""}{tab.title}
					</a>
				</li>
			)}
		</ul>
		<Panel extraClasses="tab-panel flex-column-fill p8">
			{tabs[currentTab] ? tabs[currentTab].body : ""}
		</Panel>
	</div>
}

export default Tabs;