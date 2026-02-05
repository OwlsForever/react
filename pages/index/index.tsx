import React, { useState } from "react";
import Button from "../../components/button";
import Tabs from "../../components/tabs";
import Panel from "../../components/panel";
import Icon from "../../components/icon";
import Input from "../../components/input";
import Table from "../../components/table";

function Page() {
	const data: { tags?: string[] | undefined; info: { [key: string]: string | number | React.JSX.Element; } }[] = [
		{ tags: ["tag1", "tag2", "tag3",], info: { name: "Mobile Factory", version: "0.3.0", downloads: 81597, trending: 21088, lastUpdate: "10 hours ago" } },
		{ tags: ["tag2", "tag3", "tag5",], info: { name: "Pyanodons Petroleum Handling", downloads: 138682, trending: 11126 } },
		{ tags: ["tag1"], info: { name: "Krastorio 2", version: "1.0.7", downloads: 305931, trending: 1828, lastUpdate: "1 month ago" } },
		{ tags: ["tag2"], info: { name: "Even Distribution", downloads: 521939, trending: 1808 } },
		{ tags: ["tag3", "tag4", "tag5",], info: { name: "Factorissimo2", version: "2.4.5", downloads: 602873, trending: 1571, lastUpdate: "1 week ago" } },
	];

	const [inputText, setInputText] = useState("");
	const buttonClass = "w320 h50 mr8 mb8";

	return (
		<>
			<Tabs
				startTab="multipleTables"
				tabs={{
					inputs: {
						title: "Inputs",
						body: <div style={{ overflow: "auto" }}>
							<Input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="placeholder" />
						</div>,
					},
					panels: {
						title: "Panels",
						body: <>
							<Panel>
								<Panel extraClasses="p8" color="lighter">1</Panel>
								<Panel extraClasses="mt8 p8" >2</Panel>
								<Panel extraClasses="mt8 p8" color="darker">3</Panel>
								<Panel extraClasses="mt8 p8" color="lighter" shadowType="inset">4</Panel>
								<Panel extraClasses="mt8 p8" shadowType="inset">5</Panel>
								<Panel extraClasses="mt8 p8" color="darker" shadowType="inset">6</Panel>
								<Panel extraClasses="mt8 p8" color="lighter" shadowType="inset small">7</Panel>
								<Panel extraClasses="mt8 p8" shadowType="inset small">8</Panel>
								<Panel extraClasses="mt8 p8" color="darker" shadowType="inset small">9</Panel>
							</Panel>
						</>,
					},
					button: {
						title: "Buttons",
						body: <div style={{ overflow: "auto" }}>
							<table>
								<tbody>
									<tr>
										<td><Button text="button" extraClasses={buttonClass} /></td>
										<td><Button text="button green" color="green" extraClasses={buttonClass} /></td>
										<td><Button text="button red" color="red" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="button hover" extraClasses={"hover " + buttonClass} /></td>
										<td><Button text="button green hover" color="green" extraClasses={"hover " + buttonClass} /></td>
										<td><Button text="button red hover" color="red" extraClasses={"hover " + buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="button active" extraClasses={"active " + buttonClass} /></td>
										<td><Button text="button green active" color="green" extraClasses={"active " + buttonClass} /></td>
										<td><Button text="button red active" color="red" extraClasses={"active " + buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="button disabled" disabled={true} extraClasses={buttonClass} /></td>
										<td><Button text="button green disabled" color="green" disabled={true} extraClasses={buttonClass} /></td>
										<td><Button text="button red disabled" color="red" disabled={true} extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="r button" arrow="right" extraClasses={buttonClass} /></td>
										<td><Button text="r button green" color="green" arrow="right" extraClasses={buttonClass} /></td>
										<td><Button text="r button red" color="red" arrow="right" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="r button hover" extraClasses={"hover " + buttonClass} arrow="right" /></td>
										<td><Button text="r button green hover" color="green" extraClasses={"hover " + buttonClass} arrow="right" /></td>
										<td><Button text="r button red hover" color="red" extraClasses={"hover " + buttonClass} arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="r button active" extraClasses={"active " + buttonClass} arrow="right" /></td>
										<td><Button text="r button green active" color="green" extraClasses={"active " + buttonClass} arrow="right" /></td>
										<td><Button text="r button red active" color="red" extraClasses={"active " + buttonClass} arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="r button disabled" disabled={true} arrow="right" extraClasses={buttonClass} /></td>
										<td><Button text="r button green disabled" color="green" disabled={true} arrow="right" extraClasses={buttonClass} /></td>
										<td><Button text="r button red disabled" color="red" disabled={true} arrow="right" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="l button" arrow="left" extraClasses={buttonClass} /></td>
										<td><Button text="l button green" color="green" arrow="left" extraClasses={buttonClass} /></td>
										<td><Button text="l button red" color="red" arrow="left" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="l button hover" extraClasses={"hover " + buttonClass} arrow="left" /></td>
										<td><Button text="l button green hover" color="green" extraClasses={"hover " + buttonClass} arrow="left" /></td>
										<td><Button text="l button red hover" color="red" extraClasses={"hover " + buttonClass} arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="l button active" extraClasses={"active " + buttonClass} arrow="left" /></td>
										<td><Button text="l button green active" color="green" extraClasses={"active " + buttonClass} arrow="left" /></td>
										<td><Button text="l button red active" color="red" extraClasses={"active " + buttonClass} arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="l button disabled" disabled={true} arrow="left" extraClasses={buttonClass} /></td>
										<td><Button text="l button green disabled" color="green" disabled={true} arrow="left" extraClasses={buttonClass} /></td>
										<td><Button text="l button red disabled" color="red" disabled={true} arrow="left" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="lr button" arrow="both" extraClasses={buttonClass} /></td>
										<td><Button text="lr button green" color="green" arrow="both" extraClasses={buttonClass} /></td>
										<td><Button text="lr button red" color="red" arrow="both" extraClasses={buttonClass} /></td>
									</tr>
									<tr>
										<td><Button text="lr button hover" extraClasses={"hover " + buttonClass} arrow="both" /></td>
										<td><Button text="lr button green hover" color="green" extraClasses={"hover " + buttonClass} arrow="both" /></td>
										<td><Button text="lr button red hover" color="red" extraClasses={"hover " + buttonClass} arrow="both" /></td>
									</tr>
									<tr>
										<td><Button text="lr button active" extraClasses={"active " + buttonClass} arrow="both" /></td>
										<td><Button text="lr button green active" color="green" extraClasses={"active " + buttonClass} arrow="both" /></td>
										<td><Button text="lr button red active" color="red" extraClasses={"active " + buttonClass} arrow="both" /></td>
									</tr>
									<tr>
										<td><Button text="lr button disabled" disabled={true} arrow="both" extraClasses={buttonClass} /></td>
										<td><Button text="lr button green disabled" color="green" disabled={true} arrow="both" extraClasses={buttonClass} /></td>
										<td><Button text="lr button red disabled" color="red" disabled={true} arrow="both" extraClasses={buttonClass} /></td>
									</tr>
								</tbody>
							</table>
							<table>
								<tbody>
									<tr>
										<td><Button text="button" /></td>
										<td><Button text="button green" color="green" /></td>
										<td><Button text="button red" color="red" /></td>
									</tr>
									<tr>
										<td><Button text="button hover" extraClasses="hover" /></td>
										<td><Button text="button green hover" color="green" extraClasses="hover" /></td>
										<td><Button text="button red hover" color="red" extraClasses="hover" /></td>
									</tr>
									<tr>
										<td><Button text="button active" extraClasses="active" /></td>
										<td><Button text="button green active" color="green" extraClasses="active" /></td>
										<td><Button text="button red active" color="red" extraClasses="active" /></td>
									</tr>
									<tr>
										<td><Button text="button disabled" disabled={true} /></td>
										<td><Button text="button green disabled" color="green" disabled={true} /></td>
										<td><Button text="button red disabled" color="red" disabled={true} /></td>
									</tr>
									<tr>
										<td><Button text="r button" arrow="right" /></td>
										<td><Button text="r button green" color="green" arrow="right" /></td>
										<td><Button text="r button red" color="red" arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="r button hover" extraClasses="hover" arrow="right" /></td>
										<td><Button text="r button green hover" color="green" extraClasses="hover" arrow="right" /></td>
										<td><Button text="r button red hover" color="red" extraClasses="hover" arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="r button active" extraClasses="active" arrow="right" /></td>
										<td><Button text="r button green active" color="green" extraClasses="active" arrow="right" /></td>
										<td><Button text="r button red active" color="red" extraClasses="active" arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="r button disabled" disabled={true} arrow="right" /></td>
										<td><Button text="r button green disabled" color="green" disabled={true} arrow="right" /></td>
										<td><Button text="r button red disabled" color="red" disabled={true} arrow="right" /></td>
									</tr>
									<tr>
										<td><Button text="l button" arrow="left" /></td>
										<td><Button text="l button green" color="green" arrow="left" /></td>
										<td><Button text="l button red" color="red" arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="l button hover" extraClasses="hover" arrow="left" /></td>
										<td><Button text="l button green hover" color="green" extraClasses="hover" arrow="left" /></td>
										<td><Button text="l button red hover" color="red" extraClasses="hover" arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="l button active" extraClasses="active" arrow="left" /></td>
										<td><Button text="l button green active" color="green" extraClasses="active" arrow="left" /></td>
										<td><Button text="l button red active" color="red" extraClasses="active" arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="l button disabled" disabled={true} arrow="left" /></td>
										<td><Button text="l button green disabled" color="green" disabled={true} arrow="left" /></td>
										<td><Button text="l button red disabled" color="red" disabled={true} arrow="left" /></td>
									</tr>
									<tr>
										<td><Button text="lr button" arrow="both" /></td>
										<td><Button text="lr button green" color="green" arrow="both" /></td>
										<td><Button text="lr button red" color="red" arrow="both" /></td>
									</tr>
									<tr>
										<td><Button text="lr button hover" extraClasses="hover" arrow="both" /></td>
										<td><Button text="lr button green hover" color="green" extraClasses="hover" arrow="both" /></td>
										<td><Button text="lr button red hover" color="red" extraClasses="hover" arrow="both" /></td>
									</tr>
									<tr>
										<td><Button text="lr button active" extraClasses="active" arrow="both" /></td>
										<td><Button text="lr button green active" color="green" extraClasses="active" arrow="both" /></td>
										<td><Button text="lr button red active" color="red" extraClasses="active" arrow="both" /></td>
									</tr>
									<tr>
										<td><Button text="lr button disabled" disabled={true} arrow="both" /></td>
										<td><Button text="lr button green disabled" color="green" disabled={true} arrow="both" /></td>
										<td><Button text="lr button red disabled" color="red" disabled={true} arrow="both" /></td>
									</tr>
								</tbody>
							</table>
							<table>
								<tbody>
									<tr>
										<td><Button text="button" small={true} /></td>
										<td><Button text="button green" color="green" small={true} /></td>
										<td><Button text="button red" color="red" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="button hover" extraClasses="hover" small={true} /></td>
										<td><Button text="button green hover" color="green" extraClasses="hover" small={true} /></td>
										<td><Button text="button red hover" color="red" extraClasses="hover" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="button active" extraClasses="active" small={true} /></td>
										<td><Button text="button green active" color="green" extraClasses="active" small={true} /></td>
										<td><Button text="button red active" color="red" extraClasses="active" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="button disabled" disabled={true} small={true} /></td>
										<td><Button text="button green disabled" color="green" disabled={true} small={true} /></td>
										<td><Button text="button red disabled" color="red" disabled={true} small={true} /></td>
									</tr>
									<tr>
										<td><Button text="r button" arrow="right" small={true} /></td>
										<td><Button text="r button green" color="green" arrow="right" small={true} /></td>
										<td><Button text="r button red" color="red" arrow="right" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="r button hover" extraClasses="hover" arrow="right" small={true} /></td>
										<td><Button text="r button green hover" color="green" extraClasses="hover" arrow="right" small={true} /></td>
										<td><Button text="r button red hover" color="red" extraClasses="hover" arrow="right" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="r button active" extraClasses="active" arrow="right" small={true} /></td>
										<td><Button text="r button green active" color="green" extraClasses="active" arrow="right" small={true} /></td>
										<td><Button text="r button red active" color="red" extraClasses="active" arrow="right" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="r button disabled" disabled={true} arrow="right" small={true} /></td>
										<td><Button text="r button green disabled" color="green" disabled={true} arrow="right" small={true} /></td>
										<td><Button text="r button red disabled" color="red" disabled={true} arrow="right" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="l button" arrow="left" small={true} /></td>
										<td><Button text="l button green" color="green" arrow="left" small={true} /></td>
										<td><Button text="l button red" color="red" arrow="left" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="l button hover" extraClasses="hover" arrow="left" small={true} /></td>
										<td><Button text="l button green hover" color="green" extraClasses="hover" arrow="left" small={true} /></td>
										<td><Button text="l button red hover" color="red" extraClasses="hover" arrow="left" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="l button active" extraClasses="active" arrow="left" small={true} /></td>
										<td><Button text="l button green active" color="green" extraClasses="active" arrow="left" small={true} /></td>
										<td><Button text="l button red active" color="red" extraClasses="active" arrow="left" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="l button disabled" disabled={true} arrow="left" small={true} /></td>
										<td><Button text="l button green disabled" color="green" disabled={true} arrow="left" small={true} /></td>
										<td><Button text="l button red disabled" color="red" disabled={true} arrow="left" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="lr button" arrow="both" small={true} /></td>
										<td><Button text="lr button green" color="green" arrow="both" small={true} /></td>
										<td><Button text="lr button red" color="red" arrow="both" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="lr button hover" extraClasses="hover" arrow="both" small={true} /></td>
										<td><Button text="lr button green hover" color="green" extraClasses="hover" arrow="both" small={true} /></td>
										<td><Button text="lr button red hover" color="red" extraClasses="hover" arrow="both" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="lr button active" extraClasses="active" arrow="both" small={true} /></td>
										<td><Button text="lr button green active" color="green" extraClasses="active" arrow="both" small={true} /></td>
										<td><Button text="lr button red active" color="red" extraClasses="active" arrow="both" small={true} /></td>
									</tr>
									<tr>
										<td><Button text="lr button disabled" disabled={true} arrow="both" small={true} /></td>
										<td><Button text="lr button green disabled" color="green" disabled={true} arrow="both" small={true} /></td>
										<td><Button text="lr button red disabled" color="red" disabled={true} arrow="both" small={true} /></td>
									</tr>
								</tbody>
							</table>
						</div>,
					},
					buttonIconOnly: {
						title: "Buttons IOnly",
						body: <table>
							<tbody>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="hover" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="hover" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="hover" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="active" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="active" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="active" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} disabled={true} /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" disabled={true} /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" disabled={true} /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" arrow="right" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="hover" arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="hover" arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="hover" arrow="right" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="active" arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="active" arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="active" arrow="right" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} disabled={true} arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" disabled={true} arrow="right" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" disabled={true} arrow="right" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" arrow="left" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="hover" arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="hover" arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="hover" arrow="left" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="active" arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="active" arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="active" arrow="left" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} disabled={true} arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" disabled={true} arrow="left" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" disabled={true} arrow="left" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" arrow="both" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="hover" arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="hover" arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="hover" arrow="both" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} extraClasses="active" arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" extraClasses="active" arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" extraClasses="active" arrow="both" /></td>
								</tr>
								<tr>
									<td><Button icon={{ name: "square-js", type: "brands" }} disabled={true} arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="green" disabled={true} arrow="both" /></td>
									<td><Button icon={{ name: "square-js", type: "brands" }} color="red" disabled={true} arrow="both" /></td>
								</tr>
							</tbody>
						</table>,
					},
					otherButtons: {
						title: "Other buttons",
						body: <div style={{ overflow: "auto" }}>
							<Button key={6} text="icon lefticon left" iconLeft={{ name: "left-long", type: "solid" }} />
							<Button key={7} text="icon righticon right" iconRight={{ name: "right-long", type: "solid" }} />
							<Button key={8} text="2 icons2 icons" iconLeft={{ name: "left-long", type: "solid" }} iconRight={{ name: "right-long", type: "solid" }} />
						</div>,
					},
					iconsAndScroll: {
						title: "Icons + scroll",
						icon: { name: "dice-d20", type: "solid" },
						body: <div style={{ overflow: "auto" }}>
							<Icon icon={{ name: "dice", type: "solid" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", flip: "horizontal" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", flip: "vertical" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", flip: "both" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", rotation: "90" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", rotation: "180" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", rotation: "270" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "beat" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "beat-fade" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "bounce" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "fade" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "flip" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "pulse" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "shake" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "spin" }} extraClasses="m10" />
							<Icon icon={{ name: "dice", type: "solid", animation: "spin-pulse" }} extraClasses="m10" />
							{new Array(100).fill(0).map((__, i) => <div key={i}>OWL</div>)}
						</div>
					},
					table: {
						title: "Table",
						icon: { name: "dice-d20", type: "solid" },
						body: <Table
							header={{
								name: { title: "Name", sortable: true },
								version: { title: "Version", sortable: true },
								downloads: { title: "Downloads", sortable: true },
								trending: { title: "Trending", sortable: true },
								lastUpdate: { title: "Last updated", sortable: true }
							}}
							data={data}
						/>,
					},
					multipleTables: {
						title: "Miltiple Tables",
						icon: { name: "table", type: "solid" },
						body: <>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
							<h1>Header</h1>
							<Table
								header={{
									name: { title: "Name", sortable: true },
									version: { title: "Version", sortable: true },
									downloads: { title: "Downloads", sortable: true },
									trending: { title: "Trending", sortable: true },
									lastUpdate: { title: "Last updated", sortable: true }
								}}
								stickyHeader={true}
								data={data}
							/>
						</>,
					},
					tableLong: {
						title: "Table long",
						icon: { name: "dice-d20", type: "solid" },
						body: <Table
							header={{
								name: { title: "Name", sortable: true },
								version: { title: "Version", sortable: true },
								downloads: { title: "Downloads", sortable: true },
								trending: { title: "Trending", sortable: true },
								lastUpdate: { title: "Last updated", sortable: true }
							}}
							data={[data, data, data, data, data, data, data, data, data].flat()}
						/>,
					},
				}}
				cssStyle={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					overflow: "hidden",
				}}
				panelExtraClasses="p8"
				panelStyle={{
					flex: 1,
					overflow: "auto",
				}}
			/>
		</>
		// <Table
		// 	header={{
		// 		name: { title: "Name", sortable: true },
		// 		version: { title: "Version", sortable: true },
		// 		downloads: { title: "Downloads", sortable: true },
		// 		trending: { title: "Trending", sortable: true },
		// 		lastUpdate: { title: "Last updated", sortable: true }
		// 	}}
		// 	data={[data, data, data, data, data, data, data, data, data].flat()}
		// 	tagFilter={true}
		// />
	)
};

export default Page;
