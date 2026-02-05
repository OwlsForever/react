export enum CellTypes {
	Regular = "regular",
	Enemy = "enemy",
	StatUp = "biscuits",
	StatDown = "chocolate",
	Bomb = "explosive",
	Wall = "wall",
	Start = "start",
	End = "portal",
}

export enum Rarity {
	Common = 0,
	Rare = 1,
	Epic = 2,
	Legendary = 3,
}

export const rarityNames = [
	"Common",
	"Rare",
	"Epic",
	"Legendary",
];

export type AttrNameFull = "total" | "beauty" | "cuteness" | "strength" | "wisdom";
export type AttrNameShort = "t" | "b" | "c" | "s" | "w";
export type AttrName = AttrNameFull | AttrNameShort;
export type Cell = {
	type: CellTypes.Regular | CellTypes.StatUp | CellTypes.StatDown,
	name: AttrName,
} | {
	type: CellTypes.Enemy,
	name: AttrName,
	value: number,
} | {
	type: CellTypes.Bomb | CellTypes.Wall | CellTypes.Start | CellTypes.End,
}

export type DreamieStats = {
	beauty: number;
	cuteness: number;
	strength: number;
	wisdom: number;
}

export type DreamieStatsCodex = DreamieStats & { rarity: Rarity; }

type Dreamie = DreamieStats & { name: string; }

export type DreamieEvent = Dreamie & { isAvailable: number, total: number; };