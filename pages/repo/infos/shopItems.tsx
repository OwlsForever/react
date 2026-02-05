import React from "react";

export const upgrades: { [key: string]: string | number | React.JSX.Element }[] = [
	{
		name: "Strength",
		price: "$5K - $8K",
		description: "+1 силы",
		count: "2",
	},
	{
		name: "Range",
		price: "$5K - $8K",
		description: "Дальность +1u (base 4u)",
		count: "3",
	},
	{
		name: "Stamina",
		price: "$2K - $3K",
		description: "+10 стамины",
		count: "4",
	},
	{
		name: "Sprint Speed",
		price: "$5K - $8K",
		description: "скорость +1u/с, потребление стамины -1e/с (base 5u/с, 10e/с)",
		count: "3",
	},
	{
		name: "Crouch Rest",
		price: "$6K - $8K",
		description: "+1 энергии/с в присяде (base 3/с)",
		count: "3",
	},
	{
		name: "Health",
		price: "$4K - $5K",
		description: "+20 хп",
		count: "2",
	},
	{
		name: "Map Player Count",
		price: "$9K - $12K",
		description: "Показывает сколько живых",
		count: "1",
	},
	{
		name: "Tumble Launch",
		price: "$4K - $5K",
		description: "+скорость и дальность запуска",
		count: "1",
	},
	{
		name: "Tumble Wings",
		price: "$9K - $12K",
		description: "+длительность полёта скукоженным (+1.2c/5 lvl, на 5 уровне ~2.4с)",
		count: "1",
	},
	{
		name: "Extra Jump",
		price: "$9K - $12K",
		description: "+1 прыжок",
		count: "1",
	},
	{
		name: "Death Head Battery",
		price: "$6K - $7K",
		description: "Дольше говоришь трупом",
		count: "1",
	},
	{
		name: "Tumble Climb",
		price: "$2K",
		description: "Позволяет карабкаться в скукоженной форме",
		count: "1",
	},
];
export const meleeWeapons = [
	{
		name: "Baseball Bat",
		price: "$25K - $45K",
		damage: "20",
		charges: "10",
		description: "Вызывает небольшой стан и сильное отталкивание (25-50 доп урона)",
		batteryChargeNeed: 1,
	},
	{
		name: "Frying Pan",
		price: "$15K - $17K",
		damage: "18",
		charges: "15",
		description: "Небольшой стан и отталкивание мелких монстров",
		batteryChargeNeed: 1,
	},
	{
		name: "Sledge Hammer",
		price: "$40K - $47K",
		damage: "150",
		charges: "10",
		description: "Много урона + стан",
		batteryChargeNeed: 1,
	},
	{
		name: "Sword",
		price: "$19K - $20K",
		damage: "50",
		charges: "15",
		description: "Им легко махать, небольшой стан и отталкивание мелких монстров",
		batteryChargeNeed: 1,
	},
	{
		name: "Inflatable Hammer",
		price: "$9K - $18K",
		damage: "5 (250)",
		charges: "20",
		description: "Есть ~5% на взрыв (250 урона и сильное отталкивание)",
		batteryChargeNeed: 1,
	},
	{
		name: "Prodzap",
		price: "$24K - $30K",
		damage: "8",
		charges: "16",
		description: "Станит на 3 секунды",
		batteryChargeNeed: 1,
	}
];
export const rangedWeapons = [
	{
		name: "Gun",
		price: "$19K - $20K",
		damage: "80/100",
		charges: "15",
		description: "Станит монстров 1-2 тира?",
		noise: 10,
		batteryChargeNeed: 1,
	},
	{
		name: "Shotgun",
		price: "$39K - $48K",
		damage: "6x50",
		charges: "5",
		description: "Очень сильный разброс",
		noise: 20,
		batteryChargeNeed: 1,
	},
	{
		name: "Tranq Gun",
		price: "$15K - $18K",
		damage: "0",
		charges: "8",
		description: "Станит на 18 секунд",
		noise: 0,
		batteryChargeNeed: 1,
	},
	{
		name: "Pulse Pistol",
		price: "$15K - $18K",
		damage: "25/0",
		charges: "12",
		description: "Станит и отталкивает",
		noise: 7.5,
		batteryChargeNeed: 1,
	},
	{
		name: "Photon Blaster",
		price: "$39K - $48K",
		damage: "45x6/?",
		charges: "5",
		description: "Заряжается секунду, после пару секунд атакует лучом. Сильное отталкивание. Хорош для атаки толп",
		noise: 15,
		batteryChargeNeed: 1,
	},
	{
		name: "Boltzap",
		price: "$15k - $18k",
		damage: "8/0",
		charges: "20",
		description: "Станит на 1.5 секунды",
		noise: 1.5,
		batteryChargeNeed: 1,
	},
	{
		name: "C.A.R.T. Cannon",
		price: "$39K - $48K",
		damage: "500/50",
		charges: "5",
		description: "Стреляет взрывающимся ядром, радиус взрыва средний"
	},
	{
		name: "C.A.R.T. Laser",
		price: "$39K - $48K",
		damage: "800/200",
		charges: "5",
		description: "Заряжается секунду, после пару секунд атакует лучом. Сильное отталкивание"
	}
].map(e => ({ ...e, noise: (e.noise !== undefined) ? e.noise + "u" : "?" }));
export const explosiveWeapons = [
	{
		name: "Grenade",
		price: "$3K",
		damage: "160/75",
		range: "10m",
		description: "Взрыв через пару секунд",
		count: "3"
	},
	{
		name: "Shockwave Grenade",
		price: "$2K",
		damage: "0",
		range: "30m",
		description: "Небольшой стан + отталкивание",
		count: "3"
	},
	{
		name: "Stun Grenade",
		price: "$2K",
		damage: "0",
		range: "30m",
		description: "Станит на 15 секунд (на 2 игрока)",
		count: "3"
	},
	{
		name: "Human Grenade",
		price: "$2K",
		damage: "100/50",
		range: "10m",
		description: "Взрыв через 4 секунды",
		count: "3"
	},
	{
		name: "Duct Taped Grenade",
		price: "$2K",
		damage: "100x4/50x4",
		range: "10m",
		description: "Взрывается и разбрасывает 3 активированные гранаты",
		count: "3"
	},
	{
		name: "Shockwave Mine",
		price: "$3K",
		damage: "0",
		range: "30m",
		description: "5 секунд на активацию. Только отталкивает всех",
		count: "3"
	},
	{
		name: "Trapzap",
		price: "$3K",
		damage: "0/3",
		range: "0m",
		description: "5 секунд на активацию. 10 секунд аактивности. Каждую секунду наносит урон + станит",
		count: "3"
	},
	{
		name: "Explosive Mine",
		price: "$3K",
		damage: "200/75",
		range: "20m",
		description: "-",
		count: "3"
	},
	{
		name: "Rubber Duck",
		price: "$16K - $20K",
		damage: "50 (250)/0",
		range: "10m",
		description: "10% шанс на взрыв при отскоке. С каждым отскоком ускоряется. Через время начинает наносить урон",
		count: "1"
	}
];
export const drones = [
	{
		name: "Recharge Drone",
		effect: "12 bars",
		price: "$15K-$18K",
		lifeTime: 0,
		energyCharge: 0,
	},
	{
		name: "Indestructible Drone",
		effect: "Не даёт предмету получать урон (НЕ работает с сервизом, при наклоне теряет стоимость)",
		price: "$23K - $30K",
		lifeTime: 32 * 6,
		energyCharge: 0,
		batteryChargeNeed: 1,
	},
	{
		name: "Roll Drone",
		effect: "Предмет катится в сторону игрока (получая урон), игрок -- в направлении взгляда, монстр -- от игрока",
		price: "$9K-$12K",
		lifeTime: 32 * 6,
		energyCharge: 0,
		batteryChargeNeed: 1,
	},
	{
		name: "Feather Drone",
		effect: "Делает предмет (монстра, игрока) очень лёгким",
		price: "$15K-$18K",
		lifeTime: 32 * 6,
		energyCharge: 0,
		batteryChargeNeed: 1,
	},
	{
		name: "Zero Gravity Drone",
		effect: "Убирает гравитацию",
		price: "$23K - $29K",
		lifeTime: 32 * 6,
		energyCharge: 0,
		batteryChargeNeed: 1,
	},
	{
		name: "Zero Gravity Orb",
		effect: "Убирает гравитацию в области, радиус 4u",
		price: "$42K - $43K",
		lifeTime: 32 * 6,
		energyCharge: 0,
		batteryChargeNeed: 1,
	},
];
