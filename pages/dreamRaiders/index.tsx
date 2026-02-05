import React, { Fragment, useEffect, useState } from "react";
import Button from "../../components/button";
import Input from "../../components/input";
import Tabs from "../../components/tabs";
import Panel from "../../components/panel";
import { dreamieCodex } from "./infos/dreamies";
import { AttrNameShort, Cell, CellTypes, DreamieEvent, DreamieStats } from "./infos/typesAndUtils";
import Table from "../../components/table";

const getCoefByStar = (star: string) => {
	switch (star) {
		case "6": return 60;
		case "5": return 48;
		case "4": return 38;
		case "3": return 30;
		case "2": return 24;
		case "1": return 22;
		default: return 0;
	}
}

type ResultType = DreamieEvent & { bestPoints: number; bestPath: string; bestPointHistory: string; };

const result2s = (res: ResultType) => [
	res.name,
	`Point: ${res.bestPoints}`,
	`Path: ${res.bestPath}`,
	`History: ${res.bestPointHistory}`,
	`Total: ${res.total}`,
	`Beauty: ${res.beauty}     Cuteness: ${res.cuteness}`,
	`Strength: ${res.strength}   Wisdom: ${res.wisdom}`,
].join("\n");

function Page() {
	const [dreamiesInfo, setDreamiesInfo] = useState(localStorage.getItem("dreamiesInfo") ?? "");
	const [mapInfo, setMapInfo] = useState(localStorage.getItem("dreamieMap") ?? "");
	useEffect(() => localStorage.setItem("dreamieMap", mapInfo), [mapInfo]);
	const [pointsLimit, setPointsLimit] = useState(localStorage.getItem("pointsLimit") ?? "0");
	useEffect(() => localStorage.setItem("pointsLimit", pointsLimit), [pointsLimit]);
	const [output, setOutput] = useState("");
	useEffect(() => localStorage.setItem("pointsLimit", pointsLimit), [pointsLimit]);
	const [beautyBonus, setBeautyBonus] = useState(localStorage.getItem("beautyBonus") ?? "0");
	const [cutenessBonus, setCutenessBonus] = useState(localStorage.getItem("cutenessBonus") ?? "0");
	const [strengthBonus, setStrengthBonus] = useState(localStorage.getItem("strengthBonus") ?? "0");
	const [wisdomBonus, setWisdomBonus] = useState(localStorage.getItem("wisdomBonus") ?? "0");
	const loadBonuses = () => {
		setBeautyBonus(localStorage.getItem("beautyBonus") ?? "0");
		setCutenessBonus(localStorage.getItem("cutenessBonus") ?? "0");
		setStrengthBonus(localStorage.getItem("strengthBonus") ?? "0");
		setWisdomBonus(localStorage.getItem("wisdomBonus") ?? "0");
	}
	const saveBonuses = () => {
		localStorage.setItem("beautyBonus", beautyBonus);
		localStorage.setItem("cutenessBonus", cutenessBonus);
		localStorage.setItem("strengthBonus", strengthBonus);
		localStorage.setItem("wisdomBonus", wisdomBonus);
	}

	const [result, setResult] = useState([] as ResultType[]);

	const [dreamies, setDreamies] = useState([] as DreamieEvent[]);
	useEffect(() => {
		const bonusTotal = +beautyBonus + +cutenessBonus + +strengthBonus + +wisdomBonus;
		const processedDreamies: DreamieEvent[] = dreamiesInfo.split(/\n/).filter(e => e != "").map(e => {
			const [isAvailable, star, ...nameRaw] = e.split(" ");
			const name = nameRaw.join(" ");
			// const [isAvailable, beautyRaw, cutenessRaw, strengthRaw, wisdomRaw, ...name] = e.split(" ");
			const k = getCoefByStar(star);
			if (dreamieCodex[name] === undefined) return;
			const beauty = Math.round(dreamieCodex[name].beauty / 60 * k + +beautyBonus);
			const cuteness = Math.round(dreamieCodex[name].cuteness / 60 * k + +cutenessBonus);
			const strength = Math.round(dreamieCodex[name].strength / 60 * k + +strengthBonus);
			const wisdom = Math.round(dreamieCodex[name].wisdom / 60 * k + +wisdomBonus);
			return {
				// isAvailable: true,
				isAvailable: +isAvailable,
				total: beauty + cuteness + strength + wisdom,
				beauty,
				cuteness,
				strength,
				wisdom,
				name,
			}
		}).filter(e => e !== undefined && e.total > bonusTotal) as DreamieEvent[];
		setDreamies(processedDreamies);
		// console.log(processedDreamies);
	}, [dreamiesInfo, beautyBonus, cutenessBonus, strengthBonus, wisdomBonus]);
	const setDefaultDreamies = (rarity: number) => setDreamiesInfo(
		Object.entries(dreamieCodex)
			.filter(e => e[1].rarity >= rarity)
			.map(e => "1  " + e[0]).join("\n")
	);

	const processMap = () => {
		const map: Cell[][] = mapInfo
			.split(/\n/)
			.filter(e => e !== "")
			.map(e => e.split(" ").map(e => {
				const name = e[0] as AttrNameShort;
				if (e.length == 1) switch (e) {
					case "e": return { type: CellTypes.Bomb };
					case "0": return { type: CellTypes.Start };
					case "p": return { type: CellTypes.End };
					default: return { type: CellTypes.Regular, name };
				}
				if (e.length == 2) return { type: e[1] == "u" || e[1] == "+" ? CellTypes.StatUp : CellTypes.StatDown, name };
				return { type: CellTypes.Enemy, name, value: +e.slice(1) };
			}));
		var bestPoints = 0;
		var bestPath: string[] = [];
		var bestPointHistory: number[] = [];
		const recursiveSearch = (
			dreamie: DreamieEvent,
			i: number = (map.length - 1),
			j: number = 0,
			currentPath: string[] = [],
			points: number = 0,
			pointHistory: number[] = [],
		) => {
			const cell = map[i][j];
			const getName = (name: string) => {
				var res = "";
				switch (name) {
					case "t": res = "total"; break;
					case "b": res = "beauty"; break;
					case "c": res = "cuteness"; break;
					case "s": res = "strength"; break;
					case "w": res = "wisdom"; break;
					default: res = name;
				}
				return res as keyof DreamieStats | "total";
			}
			const dreamieStart = JSON.parse(JSON.stringify(dreamie));
			switch (cell.type) {
				case CellTypes.Regular: points += dreamie[getName(cell.name)]; break;
				case CellTypes.Enemy: {
					var name = getName(cell.name);
					if (dreamie[name] < cell.value) points = -Infinity; else {
						points += Math.round(dreamie[name] * (name == "total" ? 1.2 : 5));
					}
				} break;
				case CellTypes.StatUp: {
					var name = getName(cell.name);
					const increment = Math.round(dreamie[name] * 0.5);
					dreamie[name] += increment;
					dreamie.total += increment;
				} break;
				case CellTypes.StatDown: {
					var name = getName(cell.name);
					const decrement = Math.round(dreamie[name] * 0.3);
					dreamie[name] -= decrement;
					dreamie.total -= decrement;
				}; break;
				case CellTypes.End: {
					if (points > bestPoints) {
						bestPoints = points;
						bestPath = [...currentPath];
						bestPointHistory = [...pointHistory];
					}
					return;
				}
			}
			pointHistory.push(points);
			const upType = map[i - 1]?.[j]?.type;
			if (upType !== undefined && upType !== CellTypes.Wall) {
				currentPath.push("↑");
				recursiveSearch(dreamie, i - 1, j, currentPath, points, pointHistory);
				currentPath.pop();
			}
			const rightType = map[i][j + 1]?.type;
			if (rightType !== undefined && rightType !== CellTypes.Wall) {
				currentPath.push("→");
				recursiveSearch(dreamie, i, j + 1, currentPath, points, pointHistory);
				currentPath.pop();
			}
			pointHistory.pop();
		}
		const results = dreamies.map(e => {
			bestPoints = 0;
			bestPath = [];
			bestPointHistory = [];
			recursiveSearch(JSON.parse(JSON.stringify(e)));
			return {
				...e,
				name: e.name + (e.isAvailable ? "" : " (used)"),
				bestPoints,
				bestPath: bestPath.join(" "),
				bestPointHistory: bestPointHistory.join(" "),
			}
		}).filter(e => e.bestPoints >= +pointsLimit).sort((a, b) => b.bestPoints - a.bestPoints);
		// console.log(result);

		const best = results[0];
		const worst = results[results.length - 1];
		const output = results.length > 0 ? [
			result2s(best),
			"-------------------",
			result2s(worst),
		].join("\n") : "No path found";
		setOutput(output);
		setResult(results);
	}

	return (
		<>
			<Tabs
				// startTab="sweetTreat"
				tabs={{
					sweetTreat: {
						title: "Sweet Treat",
						icon: { name: "candy-cane", type: "solid" },
						body: <div style={{ display: "flex", flexDirection: "row", height: "100%", }}>
							<div style={{ display: "flex", flexDirection: "column", height: "100%", }}>
								<Panel extraClasses="p8" cssStyle={{ width: "300px", display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, 1fr)" }}>
									<h3 className="pb8" style={{ gridColumn: "span 2" }}>Fill defaults</h3>
									<Button text="Common+" onClick={() => setDefaultDreamies(0)} />
									<Button text="Rare+" onClick={() => setDefaultDreamies(1)} />
									<Button text="Epic+" onClick={() => setDefaultDreamies(2)} />
									<Button text="Legendary" onClick={() => setDefaultDreamies(3)} />
								</Panel>
								<Panel extraClasses="p8" cssStyle={{ width: "300px", height: "100%", display: "flex", flexFlow: "column", }}>
									<h3 className="pb8">Dreamies info</h3>
									<Input
										id="dreamies"
										extraClasses="mb8"
										value={dreamiesInfo}
										onChange={e => setDreamiesInfo(e.target.value)}
										inputTag="textarea"
										cssStyle={{ width: "100%", height: "100%", }}
									/>
									<div className="mb8">
										<Button extraClasses="mr8" text="Load" onClick={() => setDreamiesInfo(localStorage.getItem("dreamiesInfo") ?? "")} color="red" cssStyle={{ width: "calc(50% - 4px)" }} />
										<Button text="Save" onClick={() => localStorage.setItem("dreamiesInfo", dreamiesInfo)} color="green" cssStyle={{ width: "calc(50% - 4px)" }} />
									</div>
									<Button text="Set all available" onClick={() => setDreamiesInfo(dreamiesInfo.replaceAll(/\d( \d )/g, "1$1"))} cssStyle={{ width: "100%" }} />
								</Panel>
							</div>
							<div style={{ display: "flex", flexDirection: "column", height: "100%", }}>
								<Panel extraClasses="p8" cssStyle={{ width: "300px", height: "fit-content" }}>
									<h3 className="pb8">Sweet Bonus</h3>
									<div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, auto)", justifyContent: "start", alignItems: "center" }}>
										{[
											{ name: "Beauty", value: beautyBonus, setFn: setBeautyBonus },
											{ name: "Cuteness", value: cutenessBonus, setFn: setCutenessBonus },
											{ name: "Strength", value: strengthBonus, setFn: setStrengthBonus },
											{ name: "Wisdom", value: wisdomBonus, setFn: setWisdomBonus },
										].map((bonus, i) => <Fragment key={i}>
											<h5 key={i * 2} style={{ display: "inline" }}>{bonus.name}</h5>
											<Input
												key={i * 2 + 1}
												id={bonus.name.toLowerCase()}
												extraClasses={i == 3 ? "mb8" : ""}
												value={bonus.value}
												onChange={e => bonus.setFn(e.target.value)}
												cssStyle={{ width: "100px" }}
												otherAttributes={{ type: "number", min: "0" }}
											/>
										</Fragment>)}
									</div>
									<Button extraClasses="mr8" text="Load" onClick={loadBonuses} color="red" cssStyle={{ width: "calc(50% - 4px)" }} />
									<Button text="Save" onClick={saveBonuses} color="green" cssStyle={{ width: "calc(50% - 4px)" }} />
								</Panel>
								<Panel extraClasses="p8" cssStyle={{ width: "300px", height: "fit-content" }}>
									<h3 className="pb8">Map</h3>
									<h5 className="mr20" style={{ display: "inline" }}>Points limit</h5>
									<Input
										id="pointsLimit"
										extraClasses="mb8"
										value={pointsLimit}
										onChange={e => setPointsLimit(e.target.value)}
										cssStyle={{ width: "100px" }}
										otherAttributes={{ type: "number", min: "0" }}
									/>
									<Input
										id="map"
										extraClasses="mb8"
										value={mapInfo}
										onChange={e => setMapInfo(e.target.value)}
										inputTag="textarea"
										cssStyle={{ width: "100%", height: "300px" }}
									/>
									<Button text="Clear" onClick={() => setMapInfo("")} extraClasses="mr8" color="red" cssStyle={{ width: "calc(50% - 4px)" }} />
									<Button text="Process" onClick={processMap} color="green" cssStyle={{ width: "calc(50% - 4px)" }} />
								</Panel>
								<Panel extraClasses="p8" cssStyle={{ width: "300px", height: "100%", display: "flex", flexFlow: "column", }}>
									<h3 className="pb8">Output</h3>
									<Input
										id="output"
										value={output}
										onChange={e => setOutput(e.target.value)}
										inputTag="textarea"
										cssStyle={{ width: "100%", height: "100%", }}
									/>
								</Panel>
							</div>
							<Panel
								cssStyle={{
									display: "flex",
									flexDirection: "column",
									overflowY: "scroll",
								}}>
								<Table
									header={{
										name: { title: "Name", sortable: true, headerStyle: { width: "200px" } },
										bestPoints: { title: "Result", sortable: true, headerStyle: { width: "80px" } },
										total: { title: "Total", sortable: true, headerStyle: { width: "70px" } },
										beauty: { title: "Beauty", sortable: true, headerStyle: { width: "85px" } },
										cuteness: { title: "Cuteness", sortable: true, headerStyle: { width: "100px" } },
										strength: { title: "Strength", sortable: true, headerStyle: { width: "100px" } },
										wisdom: { title: "Wisdom", sortable: true, headerStyle: { width: "95px" } },
										printInfo: { title: "Show path" },
									}}
									stickyHeader={true}
									data={result.map(e => ({
										info: {
											...e, printInfo: <Button
												small={true}
												color={e.isAvailable ? "green" : "red"}
												text={"Print info" + (e.isAvailable ? "" : " (used)")}
												onClick={() => {
													const val = result2s(e);
													console.log("------------");
													console.log(val);
													setOutput(val);
												}}
											/>
										}
									}))}
								/>
							</Panel>
						</div>
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
				fillAvailable={true}
			/>
		</>
	)
};

export default Page;
