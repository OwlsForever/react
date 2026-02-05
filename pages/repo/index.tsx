import React, { useEffect, useMemo, useReducer, useState } from "react";
import Button from "../../components/button";
import Tabs from "../../components/tabs";
import Table from "../../components/table";
import Panel from "../../components/panel";
import { allMonsters } from "./infos/monsters";
import { monstersRespawnTime, mostersPerLevel, sounds } from "./infos/other";
import { drones, explosiveWeapons, meleeWeapons, rangedWeapons, upgrades } from "./infos/shopItems";

var nextId = 0;
type SelectedMonster = {
	id: number,
	name: string,
	tier: number,
	timer: { from: number, to: number }
};
type MonsterDispatcherAction = { type: "add", name: string, tier: number }
	| { type: "delete", id: number }
	| { type: "startTimer", id: number, currentTime: number }
	| { type: "updateTimers" | "clear" };
function monstersReducer(
	state: SelectedMonster[],
	action: MonsterDispatcherAction
): SelectedMonster[] {
	console.log(action);
	switch (action.type) {
		case "add": return [...state, { id: nextId++, name: action.name, tier: action.tier, timer: { from: 0, to: 0 } }];
		case "delete": return state.filter(e => e.id != action.id);
		case "startTimer": {
			const respawnTime = monstersRespawnTime.find(e => e.timeFrom <= action.currentTime && (e.timeTo ?? 0) > action.currentTime);
			return state.map(e => e.id == action.id ? { ...e, timer: { from: (respawnTime?.respawnFrom ?? 0) * 3, to: (respawnTime?.respawnTo ?? 0) * 3 } } : e);
		}
		case "updateTimers": return state.map(e => ({ ...e, timer: { from: e.timer.from > 0 ? e.timer.from - 1 : 0, to: e.timer.to > 0 ? e.timer.to - 1 : 0 } }));
		case "clear": return [];
	}
}

function MonsterItem(props: { monsterInfo: SelectedMonster, monstersDispatcher: (action: MonsterDispatcherAction) => void, currentTime: number }) {
	const { id, name, tier, timer } = props.monsterInfo;
	return <div style={{ display: "flex" }}>
		<Button
			text={name + (timer.to == 0 ? "" : ` (оживёт через ${timer.from}-${timer.to})`)}
			iconRight={{ name: (timer.from > 0 ? "skull-crossbones" : timer.to > 0 ? "heart-crack" : "heart"), type: "solid", style: { float: "inline-end" }, }}
			onClick={() => props.monstersDispatcher({ type: "startTimer", id, currentTime: props.currentTime })}
			cssStyle={{ flexGrow: 1 }}
		/>
		<Button
			icon={{ name: "trash-can", type: "regular" }}
			color="red"
			onClick={() => props.monstersDispatcher({ type: "delete", id })}
			extraClasses="ml8"
		/>
	</div>
}

// TODO: split Tabs into multiple functions
function Page() {
	const monstersByTier: { [key: number]: string[] } = useMemo(
		() => {
			console.log(allMonsters.map(e => e.name).sort());
			console.log("calculated");
			return allMonsters.reduce((res, e) => {
				var monsters = res[e.tier] ?? [];
				monsters.push(e.name);
				return { ...res, [e.tier]: monsters };
			}, {} as { [key: number]: string[] })
		}, [])
	console.log(monstersByTier);
	const [selectedMonsters, monstersDispatcher] = useReducer(monstersReducer, []);

	const [timer, setTimerValue] = useState(0);
	const [isTimerRunnig, setTimerState] = useState(false);
	useEffect(() => {
		if (isTimerRunnig) {
			const intervalId = setInterval(() => {
				setTimerValue(timer => timer + 1);
				monstersDispatcher({ type: "updateTimers" });
			}, 1000);
			return () => { console.log(intervalId); clearInterval(intervalId) };
		}
	}, [isTimerRunnig]);

	const columnStyleBase: React.CSSProperties = { verticalAlign: "middle" };
	const columnStyleMiddle: React.CSSProperties = { verticalAlign: "middle", textAlign: "center" };

	return (
		<>
			<Tabs
				startTab="other"
				tabs={{
					monsters: {
						title: "Monsters",
						icon: { name: "skull", type: "solid" },
						body: <Table
							header={{
								name: { title: "Имя офф.", sortable: true, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "120px" } },
								nameRus: { title: "Имя", sortable: true, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "100px" } },
								tier: { title: "Tier", sortable: true, columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
								hp: { title: "HP", sortable: true, columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "60px" } },
								damage: { title: "Урон", sortable: true, columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "80px" } },
								str: { title: "STR", sortable: true, columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
								ability: { title: "Поведение", sortable: false, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase } },
								surviving: { title: "Как пережить", sortable: false, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase } },
								about: { title: "Описание", sortable: false, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase } },
								orb: { title: "Орб", sortable: true, columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "150px" } },
								image: { title: "Фото", sortable: false, columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "220px" } },
							}}
							data={allMonsters.map(e => ({ info: e }))}
							tableStyle={{ tableLayout: "fixed" }}
							stickyHeader={true}
						/>,
					},
					shop: {
						title: "Shop",
						icon: { name: "shop", type: "solid" },
						body: <>
							<h1>Улучшения</h1>
							<Table
								header={{
									name: { title: "Название", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "150px" } },
									price: { title: "Цена", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "100px" } },
									description: { title: "Описание", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "320px" } },
									count: { title: "Штук", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "60px" } },
								}}
								data={upgrades.map(e => ({ info: e }))}
								tableStyle={{ tableLayout: "fixed", width: "100px" }}
								cssStyle={{ overflow: "visible" }}
								stickyHeader={true}
							/>
							<h1 className="pt16">Оружие ближнего боя</h1>
							<Table
								header={{
									name: { title: "Название", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "150px" } },
									price: { title: "Цена", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									damage: { title: "Урон", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
									charges: { title: "Заряд", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
									description: { title: "Доп. инфо", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "530px" } },
								}}
								data={meleeWeapons.map(e => ({ info: e }))}
								tableStyle={{ tableLayout: "fixed", width: "100px" }}
								noScroll={true}
								stickyHeader={true}
							/>
							<h1 className="pt16">Оружие дальнего боя</h1>
							<Table
								header={{
									name: { title: "Название", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "120px" } },
									price: { title: "Цена", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									damage: { title: "Урон (монстр/игрок)", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "190px" } },
									charges: { title: "Заряд", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
									noise: { title: "Шум", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "70px" } },
									description: { title: "Доп. инфо", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "770px" } },
								}}
								data={rangedWeapons.map(e => ({ info: e }))}
								tableStyle={{ tableLayout: "fixed", width: "100px" }}
								noScroll={true}
								stickyHeader={true}
							/>
							<h1 className="pt16">Взрывчатка</h1>
							<Table
								header={{
									name: { title: "Название", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "160px" } },
									price: { title: "Цена", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									damage: { title: "Урон (монстр/игрок)", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "190px" } },
									range: { title: "Дальность", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									description: { title: "Доп. инфо", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "770px" } },
									count: { title: "Штук", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "60px" } },
								}}
								data={explosiveWeapons.map(e => ({ info: e }))}
								tableStyle={{ tableLayout: "fixed", width: "100px" }}
								noScroll={true}
								stickyHeader={true}
							/>
							<h1 className="pt16">Дроны</h1>
							<Table
								header={{
									name: { title: "Название", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "160px" } },
									price: { title: "Цена", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									effect: { title: "Эффект", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "770px" } },
								}}
								data={drones.map(e => ({ info: e }))}
								tableStyle={{ tableLayout: "fixed", width: "100px" }}
								noScroll={true}
								stickyHeader={true}
							/>
							<p className="mt8">P.S. Время работы дрона ~32 секунды на деление (~3 минуты) если он на предмете, на игроке/монстре -- ~3.5 секунды на деление (~21 секунда)</p>
						</>,
					},
					other: {
						title: "Other",
						icon: { name: "info", type: "solid" },
						body: <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", }}>
							<Panel extraClasses="p8" cssStyle={{ width: "266px" }}>
								<h3 className="mb8">Число монстров на уровне</h3>
								<Table
									customHeader={<>
										<colgroup>
											<col style={{ width: "60px" }} />
											<col style={{ width: "40px" }} />
											<col style={{ width: "40px" }} />
											<col style={{ width: "40px" }} />
											<col style={{ width: "70px" }} />
										</colgroup>
										<thead>
											<tr>
												<th rowSpan={2} style={{ verticalAlign: "middle" }}>Game level</th>
												<th colSpan={4} >Кол-во монстров</th>
											</tr>
											<tr>
												<th>T1</th>
												<th>T2</th>
												<th>T3</th>
												<th>Всего</th>
											</tr>
										</thead>
									</>}
									header={{
										lvl: { title: "", columnStyle: columnStyleMiddle },
										t1: { title: "", columnStyle: columnStyleMiddle },
										t2: { title: "", columnStyle: columnStyleMiddle },
										t3: { title: "", columnStyle: columnStyleMiddle },
										total: { title: "", columnStyle: columnStyleMiddle },
									}}
									data={mostersPerLevel.map(({ lvlFrom, lvlTo, t1, t2, t3 }) => ({
										info: {
											lvl: lvlTo ? (lvlFrom == lvlTo ? lvlFrom : `${lvlFrom}-${lvlTo}`) : `${lvlFrom}+`,
											t1, t2, t3, total: t1 + t2 + t3
										}
									}))}
									tableStyle={{ tableLayout: "fixed", width: "100px" }}
								/>
								<p className="mt8">
									P.S.: с вероятностью 2-4.5% монстр 3 тира заменится на: 2 невидимки, 3 Таракана/Оруна/Зефирки/Руграта/Менталиста/Глаза/Шефа, 4 Утки/Блевуна/Теневого ребёнка, 6 черепушек, 10 Гномов
								</p>
								<p className="mt8">
									P.P.S.: на сколько я понял, при замене мобы будут бродить именно группой, но неизвестно поведение если убить часть группы
								</p>
							</Panel>
							<Panel extraClasses="p8" cssStyle={{ width: "460px" }}>
								<h1>Инфа по спауну, зрению и слуху монстров</h1>
								<iframe width="100%" height="300" src="https://www.youtube.com/embed/GyCMcu3uPIE" />
								<iframe width="100%" height="300" src="https://www.youtube.com/embed/HgFuEq9mcQ8" />
							</Panel>
							<Panel extraClasses="p8" cssStyle={{ width: "190px" }}>
								<h1>Время ожидания</h1>
								<Table
									header={{
										lvl: { title: "Level", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "60px" } },
										time: { title: "Время", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "100px" } },
									}}
									data={[
										{
											lvl: "1",
											time: "240с - 360с"
										},
										{
											lvl: "2",
											time: "214с - 321с"
										},
										{
											lvl: "3",
											time: "134с - 202с"
										},
										{
											lvl: "4",
											time: "78с - 117с"
										},
										{
											lvl: "5",
											time: "54с - 81с"
										},
										{
											lvl: "6",
											time: "48с - 72с"
										},
										{
											lvl: "7",
											time: "47с - 70с"
										},
										{
											lvl: "8",
											time: "42с - 63с"
										},
										{
											lvl: "9",
											time: "34с - 52с"
										},
										{
											lvl: "10",
											time: "22с - 33с"
										},
										{
											lvl: "11",
											time: "0с"
										}
									].map(e => ({ info: e }))}
									tableStyle={{ tableLayout: "fixed", width: "100px" }}
								/>
								<p className="mt8">
									P.S.: с шансом 20% время ожидания может быть уменьшенно в 4-10 раз
								</p>
							</Panel>
							{/* TODO: replace fixed width something more flexible (find a way to autosquese p with text) */}
							<Panel extraClasses="p8" cssStyle={{ width: "290px" }}>
								<h1>Время респауна</h1>
								<Table
									header={{
										time: { title: "Время на уровне", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "160px" } },
										respawn: { title: "Респ через", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									}}
									data={monstersRespawnTime.map(({ timeFrom, timeTo, respawnFrom, respawnTo }) => ({
										info: {
											time: timeTo !== undefined ? `${timeFrom / 60}-${timeTo / 60} минут` : `${timeFrom / 60}+ минут/после финальной квоты`,
											respawn: respawnFrom == respawnTo ? `${respawnFrom} секунда` : `${respawnFrom / 60}-${respawnTo / 60} минут`,
										}
									}))}
									tableStyle={{ tableLayout: "fixed", width: "100px" }}
								/>
								<p className="mt8">
									P.S.: время респа х3 если монстра убили
								</p>
							</Panel>
							<Panel extraClasses="p8" >
								<h1>Звуки</h1>
								<Table
									header={{
										name: { title: "Название звука", columnStyle: columnStyleBase, headerStyle: { ...columnStyleBase, width: "150px" } },
										noise: { title: "Громкость", columnStyle: columnStyleMiddle, headerStyle: { ...columnStyleBase, width: "110px" } },
									}}
									data={sounds.map(e => ({ info: e }))}
									tableStyle={{ tableLayout: "fixed", width: "100px" }}
								/>
								<p className="mt8">Указан радиус громкости</p>
								<p className="mt8">Ширина игрока примерно 1u</p>
								<p className="mt8">Ширина грузовика 4.5u</p>
								<p className="mt8">Размер комнат 15u на 15u</p>
							</Panel>
						</div>,
					},
					helper: {
						title: "Helper",
						icon: { name: "question", type: "solid" },
						body: <div>
							<Panel extraClasses="p8" cssStyle={{ display: "inline-block" }}>
								<h3 className="mb8" style={{ textAlign: "center" }}>Таймер</h3>
								<Button
									iconRight={isTimerRunnig ? { name: "pause", type: "solid" } : { name: "play", type: "solid" }}
									text={`${Math.floor(timer / 60)}`.padStart(2, "0") + " : " + `${timer % 60}`.padStart(2, "0")}
									onClick={() => setTimerState(!isTimerRunnig)}
									extraClasses="mr8"
									cssStyle={{ minWidth: 0 }}
								/>
								<Button
									icon={{ name: "rotate-right", type: "solid" }}
									onClick={() => {
										setTimerValue(0);
										setTimerState(false);
									}}
								/>
							</Panel>
							<div>
								<Panel extraClasses="p8" cssStyle={{ display: "inline-block", verticalAlign: "top" }}>
									<h3 className="mb8" style={{ textAlign: "center" }}>Список монстров</h3>
									<div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", }}>
										{[1, 2, 3].map(tier => <Panel key={tier} extraClasses="p8" cssStyle={{ display: "flex", flexDirection: "column", }}>
											<h4 className="mb8" style={{ textAlign: "center" }}>Тир {tier}</h4>
											{monstersByTier[tier].map(name => <Button key={name} text={name} onClick={() => monstersDispatcher({ type: "add", name, tier })} />)}
										</Panel>)}
									</div>
								</Panel>
								<Panel extraClasses="p8" cssStyle={{ display: "inline-block", verticalAlign: "top" }}>
									<h3 className="mb8" style={{ textAlign: "center" }}>Список монстров на уровне</h3>
									<div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", }}>
										{[1, 2, 3].map(tier => <Panel key={tier} extraClasses="p8" cssStyle={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
											<h4 className="mb8" style={{ textAlign: "center" }}>Тир {tier}</h4>
											{selectedMonsters.filter(e => e.tier == tier).map(e => <MonsterItem key={e.id} monsterInfo={e} monstersDispatcher={monstersDispatcher} currentTime={timer} />)}
										</Panel>)}
									</div>
									<Button extraClasses="mt8" color="red" cssStyle={{ float: "inline-end" }} text="Очистить" onClick={() => monstersDispatcher({ type: "clear" })} />
								</Panel>
							</div>
						</div>,
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
