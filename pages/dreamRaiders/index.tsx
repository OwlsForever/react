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

const mapShortcuts = [
	"t -- total",
	"b -- beauty",
	"c -- cuteness",
	"s -- strength",
	"w -- wisdom",
	"prev + \"+\" -- stat up",
	"prev + \"-\" -- stat down",
	"prev + number -- enemy",
	"e -- bomb",
	"0 -- start",
	"p -- end",
	". -- wall",
].join("\n");

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

const parseMap = (s: string): Cell[][] => s.indexOf(" ") == -1 ?
	s.split(/\n/)
		.filter(e => e !== "")
		.map(e => {
			const symbols = e.split("");
			var cells: Cell[] = [];
			for (let i = 0; i < symbols.length; i++) {
				const name = symbols[i];
				switch (name) {
					case "e": cells.push({ type: CellTypes.Bomb }); break;
					case "0": cells.push({ type: CellTypes.Start }); break;
					case "p": cells.push({ type: CellTypes.End }); break;
					case ".": cells.push({ type: CellTypes.Wall }); break;
					case "t": case "b": case "c": case "s": case "w": {
						if (/\d/.test(symbols[i + 1])) {
							let number = "";
							do {
								i++;
								number += symbols[i];
							} while (/\d/.test(symbols[i + 1]));
							cells.push({ type: CellTypes.Enemy, name, value: +number });
						} else if (/[+-]/.test(symbols[i + 1])) {
							i++;
							cells.push({ type: symbols[i] == "+" ? CellTypes.StatUp : CellTypes.StatDown, name });
						} else cells.push({ type: CellTypes.Regular, name });
					} break;
				}
			}
			return cells;
		})
	: s.split(/\n/)
		.filter(e => e !== "")
		.map(e => e.split(/ +/).map(e => {
			const name = e[0] as AttrNameShort;
			if (e.length == 1) switch (e) {
				case "e": return { type: CellTypes.Bomb };
				case "0": return { type: CellTypes.Start };
				case "p": return { type: CellTypes.End };
				case ".": return { type: CellTypes.Wall };
				default: return { type: CellTypes.Regular, name };
			}
			if (e.length == 2) return { type: e[1] == "u" || e[1] == "+" ? CellTypes.StatUp : CellTypes.StatDown, name };
			return { type: CellTypes.Enemy, name, value: +e.slice(1) };
		}));

function Page() {
	const [dreamiesInfo, setDreamiesInfo] = useState(localStorage.getItem("dreamiesInfo") ?? "");
	const saveDreamiesInfo = () => localStorage.setItem("dreamiesInfo", dreamiesInfo);
	const [mapInfo, setMapInfo] = useState(localStorage.getItem("dreamieMap") ?? "");
	useEffect(() => localStorage.setItem("dreamieMap", mapInfo), [mapInfo]);
	const [pointsLimit, setPointsLimit] = useState(localStorage.getItem("pointsLimit") ?? "0");
	useEffect(() => localStorage.setItem("pointsLimit", pointsLimit), [pointsLimit]);
	const [vividCandyLimit, setVividCandyLimit] = useState(localStorage.getItem("vividCandyLimit") ?? "0");
	useEffect(() => localStorage.setItem("vividCandyLimit", vividCandyLimit), [vividCandyLimit]);
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
			const k = getCoefByStar(star);
			if (dreamieCodex[name] === undefined) return;
			const beauty = Math.round(dreamieCodex[name].beauty / 60 * k + +beautyBonus);
			const cuteness = Math.round(dreamieCodex[name].cuteness / 60 * k + +cutenessBonus);
			const strength = Math.round(dreamieCodex[name].strength / 60 * k + +strengthBonus);
			const wisdom = Math.round(dreamieCodex[name].wisdom / 60 * k + +wisdomBonus);
			return {
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
	}, [dreamiesInfo, beautyBonus, cutenessBonus, strengthBonus, wisdomBonus]);
	const setDefaultDreamies = (rarity: number) => setDreamiesInfo(
		Object.entries(dreamieCodex)
			.filter(e => e[1].rarity >= rarity)
			.map(e => "1  " + e[0]).join("\n")
	);

	const processMap = () => {
		var map: Cell[][] = parseMap(mapInfo);
		const map2 = parseMap(mapInfo.replaceAll(/ /g, ""));
		var sun: { i: number; j: number; }[] = [];
		for (let i = 0; i < map.length; i++) {
			for (let j = map[i].length - 1; j >= 0; j--) {
				const cell = map[i][j]
				if (cell.type == CellTypes.Enemy && cell.name !== "t" && cell.name != "total") sun.push({ i, j });
			}
		}
		const emptyCell: Cell = { type: CellTypes.Empty };
		var bestPoints = 0;
		var bestPath: string[] = [];
		var bestPointHistory: number[] = [];
		var bestEnergySpent: number = Infinity;
		const recursiveSearch = (
			dreamie: DreamieEvent,
			i: number = (map.length - 1),
			j: number = 0,
			currentPath: string[] = [],
			points: number = 0,
			pointHistory: number[] = [],
			energySpent: number = 0,
			vividLeft: number = +vividCandyLimit,
			vividUsedBefore: boolean = false,
		) => {
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
			const isOkForVivid = (cell: Cell) => {
				switch (cell.type) {
					case CellTypes.Regular: return getName(cell.name) == "total";
					case CellTypes.Enemy: case CellTypes.Bomb: case CellTypes.StatUp: return true;
					default: return false;
				}
			}
			var revertActions: (() => void)[] = [];
			const clearCell = (i: number, j: number) => {
				const cell = map[i][j];
				revertActions.push(() => map[i][j] = cell);
				map[i][j] = emptyCell;
			}
			const getRewardsByCell = (i: number, j: number) => {
				const cell = map[i]?.[j];
				if (cell === undefined) return 0;
				switch (cell.type) {
					case CellTypes.Regular: {
						clearCell(i, j);
						points += dreamie[getName(cell.name)];
						return true;
					}
					case CellTypes.Enemy: {
						var name = getName(cell.name);
						if (name == "total") {
							clearCell(i, j);
						} else {
							revertActions.push(() => {
								sun.forEach(({ i, j }) => map[i][j] = cell);
							});
							sun.forEach(({ i, j }) => map[i][j] = emptyCell);
						}
						points += dreamie[name] < cell.value ? -Infinity : Math.round(dreamie[name] * (name == "total" ? 1.2 : 5));
						return true;
					}
					case CellTypes.Bomb: {
						clearCell(i, j);
						getRewardsByCell(i - 1, j - 1);
						getRewardsByCell(i - 1, j);
						getRewardsByCell(i - 1, j + 1);
						getRewardsByCell(i, j - 1);
						getRewardsByCell(i, j + 1);
						getRewardsByCell(i + 1, j - 1);
						getRewardsByCell(i + 1, j);
						getRewardsByCell(i + 1, j + 1);
						return true;
					}
					case CellTypes.StatUp: {
						var name = getName(cell.name);
						const increment = Math.round(dreamie[name] * 0.5);
						const oldStat = dreamie[name];
						const oldTotal = dreamie.total;
						revertActions.push(() => {
							map[i][j] = cell;
							dreamie[name] = oldStat;
							dreamie.total = oldTotal;
						});
						map[i][j] = emptyCell;
						dreamie[name] += increment;
						dreamie.total += increment;
						return true;
					}
					case CellTypes.StatDown: {
						var name = getName(cell.name);
						const decrement = Math.round(dreamie[name] * 0.3);
						const oldStat = dreamie[name];
						const oldTotal = dreamie.total;
						revertActions.push(() => {
							map[i][j] = cell;
							dreamie[name] = oldStat;
							dreamie.total = oldTotal;
						});
						map[i][j] = emptyCell;
						dreamie[name] -= decrement;
						dreamie.total -= decrement;
						return true;
					}
				}
				return false;
			}
			const cell = map[i][j];
			if (cell.type == CellTypes.End) {
				if ((points > bestPoints && energySpent <= bestEnergySpent) || energySpent < bestEnergySpent) {
					bestPoints = points;
					bestPath = [...currentPath];
					bestPointHistory = [...pointHistory];
					bestEnergySpent = energySpent;
				}
				return;
			}
			if (cell.type == CellTypes.Enemy && getName(cell.name) !== "total") {
				i = sun[0].i;
				j = sun[0].j;
			}
			const rewardRecieved = getRewardsByCell(i, j);
			if (rewardRecieved) pointHistory.push(points);
			const revertMoveActions = revertActions;
			revertActions = [];
			if ((cell.type == CellTypes.Start || cell.type == CellTypes.StatUp || vividUsedBefore) && vividLeft > 0) {
				for (let i1 = 0; i1 < map.length; i1++) {
					for (let j1 = 0; j1 < map[i1].length; j1++) {
						if (isOkForVivid(map[i1][j1])) {
							const pointsBefore = points;
							const rewardRecieved = getRewardsByCell(i1, j1);
							if (rewardRecieved) pointHistory.push(points);
							currentPath.push(`vivid(${i1},${j1})`);
							recursiveSearch(dreamie, i, j, currentPath, points, pointHistory, energySpent, vividLeft - 1, true);
							revertActions.forEach(e => e());
							revertActions = [];
							points = pointsBefore;
							if (rewardRecieved) pointHistory.pop();
							currentPath.pop();
						}
					}
				}
			}
			const upType = map[i - 1]?.[j]?.type;
			if (upType !== undefined && upType !== CellTypes.Wall) {
				currentPath.push("↑");
				recursiveSearch(dreamie, i - 1, j, currentPath, points, pointHistory, energySpent + 1, vividLeft, false);
				currentPath.pop();
			}
			const rightType = map[i][j + 1]?.type;
			if (rightType !== undefined && rightType !== CellTypes.Wall) {
				currentPath.push("→");
				recursiveSearch(dreamie, i, j + 1, currentPath, points, pointHistory, energySpent + 1, vividLeft, false);
				currentPath.pop();
			}
			revertMoveActions.forEach(e => e());
			if (rewardRecieved) pointHistory.pop();
		}
		const results = dreamies.map(e => {
			bestPoints = 0;
			bestPath = [];
			bestPointHistory = [];
			recursiveSearch(JSON.parse(JSON.stringify(e)));
			return {
				...e,
				bestPoints,
				bestPath: bestPath.join(" "),
				bestPointHistory: bestPointHistory.join(" "),
			}
		}).filter(e => e.bestPoints >= +pointsLimit).sort((a, b) => b.bestPoints - a.bestPoints);
		
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
										<Button text="Save" onClick={saveDreamiesInfo} color="green" cssStyle={{ width: "calc(50% - 4px)" }} />
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
									<div>
										<h5 className="mr20" style={{ display: "inline" }}>Vivid candy</h5>
										<Input
											id="vividCandyLimit"
											extraClasses="mb8"
											value={vividCandyLimit}
											onChange={e => setVividCandyLimit(e.target.value)}
											cssStyle={{ width: "100px" }}
											otherAttributes={{ type: "number", min: "0" }}
										/>
									</div>
									<Input
										id="map"
										extraClasses="mb8"
										value={mapInfo}
										onChange={e => setMapInfo(e.target.value)}
										inputTag="textarea"
										cssStyle={{ width: "100%", height: "200px" }}
									/>
									<Button text="Info" onClick={() => setOutput(mapShortcuts)} extraClasses="mr8" cssStyle={{ width: "calc(50% - 4px)" }} />
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
										name: { title: "Name", sortable: true, headerStyle: { width: "210px" } },
										bestPoints: { title: "Result", sortable: true, headerStyle: { width: "80px" } },
										total: { title: "Total", sortable: true, headerStyle: { width: "70px" } },
										beauty: { title: "Beauty", sortable: true, headerStyle: { width: "85px" } },
										cuteness: { title: "Cuteness", sortable: true, headerStyle: { width: "100px" } },
										strength: { title: "Strength", sortable: true, headerStyle: { width: "100px" } },
										wisdom: { title: "Wisdom", sortable: true, headerStyle: { width: "95px" } },
										printInfo: { title: "Show path", headerStyle: { width: "144px" } },
										markAsUsed: { title: "", headerStyle: { width: "144px" } },
									}}
									stickyHeader={true}
									data={result.map((e, i) => ({
										info: {
											...e,
											name: e.name + (e.isAvailable ? "" : " (used)"),
											printInfo: <Button
												small={true}
												color={e.isAvailable ? "green" : "red"}
												text={"Print info" + (e.isAvailable ? "" : " (used)")}
												onClick={() => {
													const val = result2s(e);
													console.log("------------");
													console.log(val);
													setOutput(val);
												}}
											/>,
											markAsUsed: e.isAvailable ? <Button
												small={true}
												text={"Mark as used"}
												onClick={() => {
													setResult(result.map((e, j) => i == j ? ({ ...e, isAvailable: 0 }) : e));
													console.log()
													setDreamiesInfo(dreamiesInfo.replace(new RegExp(`\\d( \\d ${e.name})`, "g"), "0$1"));
													const val = result2s(e);
													console.log("------------");
													console.log(val);
													setOutput(val);
												}}
											/> : "",
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
