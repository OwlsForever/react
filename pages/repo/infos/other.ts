export const mostersPerLevel = [
	{ lvlFrom: 1, lvlTo: 2, t1: 1, t2: 0, t3: 1 },
	{ lvlFrom: 3, lvlTo: 5, t1: 1, t2: 1, t3: 1 },
	{ lvlFrom: 6, lvlTo: 8, t1: 2, t2: 2, t3: 2 },
	{ lvlFrom: 9, lvlTo: 10, t1: 2, t2: 3, t3: 2 },
	{ lvlFrom: 11, lvlTo: 19, t1: 2, t2: 3, t3: 3 },
	{ lvlFrom: 20, t1: 3, t2: 4, t3: 4 },
];

// all time in seconds
export const monstersRespawnTime: { timeFrom: number; timeTo?: number; respawnFrom: number; respawnTo: number; }[] = [
	{
		timeFrom: 0,
		timeTo: 10 * 60,
		respawnFrom: 4 * 60,
		respawnTo: 5 * 60,
	},
	{
		timeFrom: 10 * 60,
		timeTo: 20 * 60,
		respawnFrom: 3.2 * 60,
		respawnTo: 4 * 60,
	},
	{
		timeFrom: 20 * 60,
		timeTo: 30 * 60,
		respawnFrom: 2.4 * 60,
		respawnTo: 3 * 60,
	},
	{
		timeFrom: 30 * 60,
		timeTo: 40 * 60,
		respawnFrom: 1.6 * 60,
		respawnTo: 2 * 60,
	},
	{
		timeFrom: 40 * 60,
		timeTo: 50 * 60,
		respawnFrom: 0.8 * 60,
		respawnTo: 1 * 60,
	},
	{
		timeFrom: 50 * 60,
		respawnFrom: 1,
		respawnTo: 1,
	},
];

export const sounds = [
	{
		name: "Красться (ctrl)",
		noise: 0,
	},
	{
		name: "Ходьба",
		noise: 0.5,
	},
	{
		name: "Бег",
		noise: 2.5,
	},
	{
		name: "Голос игрока",
		noise: 5,
	},
	{
		name: "Приземление после прыжка",
		noise: 5,
	},
	{
		name: "Сломали предмет",
		noise: 7.5,
	},
	{
		name: "Открытие квоты",
		noise: 10,
	},
	{
		name: "Сдача квоты",
		noise: 10,
	},
].map(e => ({ ...e, noise: e.noise + "u" }));
