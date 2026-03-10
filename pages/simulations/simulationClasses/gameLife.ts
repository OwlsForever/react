// Simulation Parameters (easily adjustable)
// Field parameters
const BG_COLOR = "0x000000";  // Black background

// Creature count limits
const MAX_CREATURES_PER_TYPE = 50;

// Creature appearance
const CREATURE_SIZE = 6;  // All creatures have the same size
const BORDER_FEAR_DISTANCE = 50;  // Distance at which creatures start to fear borders
const BORDER_FEAR_FACTOR = 3;     // How much victims fear borders compared to predators

// Creature lifecycle
const VICTIM_MAX_AGE = 500;  // Victims die after this much age
const HUNGER_INCREASE_RATE = 0.1;
const NUTRITION_PER_VICTIM = 10;
const MAX_HUNGER = 600;
const HUNGER_THRESHOLD = 400;
const PREDATOR_WAITING_AFTER_REPRODUCE = 500;

// Reproduction thresholds (age at which reproduction occurs)
const BLUE_REPRODUCTION_TIME = 25;    // Fast reproduction
const GREEN_REPRODUCTION_TIME = 50;   // Medium reproduction
const YELLOW_REPRODUCTION_TIME = 100;  // Slow reproduction

// Movement parameters
const DIRECTION_CHANGE_PROB = 0.05;  // Only for victims
const DIRECTION_JITTER = 0.2;       // Only for victims
const FLEE_SPEED_MULTIPLIER = 1.5;
const CHASE_SPEED_MULTIPLIER = 1.2;
const HUNGRY_SPEED_MULTIPLIER = 2;

// Detection radius
const PREDATOR_DETECTION_RADIUS = 200;
const VICTIM_DETECTION_RADIUS = 100;
const EATING_DISTANCE = 5;

// TODO: add common class for VictimGroup & PredatorGroup
// TODO: adjust creatures params

class Point {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	getDistToPoint(p: Point) {
		const dx = this.x - p.x;
		const dy = this.y - p.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	move(angle: number, speed: number) {
		this.x += Math.cos(angle) * speed;
		this.y += Math.sin(angle) * speed;
		return this;
	}

	add(p: Point) {
		this.x += p.x;
		this.y += p.y;
		return this;
	}

	addVector(v: Vector) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	limit(x1: number, y1: number, x2: number, y2: number) {
		this.x = Math.max(x1, Math.min(x2, this.x));
		this.y = Math.max(y1, Math.min(y2, this.y));
		return this;
	}
}

class Vector {
	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector): this {
		if (Number.isNaN(v.x) || Number.isNaN(v.y)) debugger;
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	mul(k: number): this {
		if (Number.isNaN(k)) debugger;
		this.x *= k;
		this.y *= k;
		return this;
	}

	getMagnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(): Vector {
		const mag = this.getMagnitude();
		if (mag < 0.001) return Vector.random();
		if (Number.isNaN(this.x / mag) || Number.isNaN(this.y / mag)) debugger;
		this.x /= mag;
		this.y /= mag;
		return this;
	}

	static sum(v1: Vector, v2: Vector): Vector {
		if (Number.isNaN(v1.x) || Number.isNaN(v1.y)) debugger;
		if (Number.isNaN(v2.x) || Number.isNaN(v2.y)) debugger;
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}

	static mul(v: Vector, k: number): Vector {
		if (Number.isNaN(v.x) || Number.isNaN(v.y)) debugger;
		if (Number.isNaN(k)) debugger;
		return new Vector(v.x * k, v.y * k);
	}

	static fromPoints(from: Point, to: Point): Vector {
		return new Vector(to.x - from.x, to.y - from.y);
	}

	static random(mult: number = 1): Vector {
		const angle = Math.random() * 2 * Math.PI;
		return new Vector(Math.cos(angle) * mult, Math.sin(angle) * mult)
	}

	static zero(): Vector {
		return new Vector(0, 0)
	}
}

type Unpacked<T> = T extends (infer U)[] ? U : T;

type CreatureVictim = {
	pos: Point;
	vel: Vector;
	age: number;
	alive: boolean;
};

class VictimGroup {
	private game: GameLife;
	private color: string;
	private speed: number;
	private reproduceAfter: number;
	public creatures: CreatureVictim[];

	constructor(game: GameLife, startX: number, startY: number, color: string, speed: number, reproConst: number) {
		this.game = game;
		this.color = color;
		this.speed = speed;
		this.reproduceAfter = reproConst;
		this.creatures = [{
			pos: new Point(startX, startY),
			vel: new Vector(),
			age: 0,
			alive: true,
		}];
	}

	step(creatures: PredatorGroup[]) {
		for (let creature of this.creatures) {
			creature.vel = this.calculateVelocity(creature, creatures);
			creature.pos.addVector(creature.vel).limit(0, 0, this.game.size.width - 1, this.game.size.height - 1);
		}
	}

	reproduce() {
		var newCreatures: CreatureVictim[] = [];
		for (let creature of this.creatures) {
			if (this.creatures.length + newCreatures.length < MAX_CREATURES_PER_TYPE
				&& creature.age > 0 && creature.age % this.reproduceAfter == 0) {
				newCreatures.push({
					pos: new Point(creature.pos.x, creature.pos.y),
					vel: Vector.random(),
					age: 0,
					alive: true,
				});
			}
		}
		this.creatures = this.creatures.concat(newCreatures);
	}

	private calculateVelocity(creature: CreatureVictim, allCreatures: PredatorGroup[]) {
		// Check for border avoidance
		const borderFearVector = this.getBorderFearVector(creature.pos);

		// Check for nearby predators
		const [nearestPredator, dist] = allCreatures.reduce<[Maybe<CreaturePredator>, number]>(([minPredator, minDist], group) => {
			const [predator, dist] = group.findNearestToPoint(creature.pos);
			return dist < minDist ? [predator, dist] : [minPredator, minDist];
		}, [undefined, Infinity]);

		if (nearestPredator && dist <= VICTIM_DETECTION_RADIUS) {
			return Vector.fromPoints(nearestPredator.pos, creature.pos)
				.add(borderFearVector)
				.normalize()
				.mul(this.speed * FLEE_SPEED_MULTIPLIER);
		} else {
			const baseVector = Math.random() <= DIRECTION_CHANGE_PROB
				? Vector.random()
				: Vector.random(DIRECTION_JITTER).add(creature.vel).normalize();

			return baseVector.add(borderFearVector).normalize().mul(this.speed)
		}
	}

	findNearestToPoint(pos: Point): [Maybe<Unpacked<typeof this.creatures>>, number] {
		return this.creatures.reduce<[Maybe<CreatureVictim>, number]>(([minC, minDist], c) => {
			let dist = pos.getDistToPoint(c.pos);
			if (dist < minDist) {
				return [c, dist];
			}
			return [minC, minDist]
		}, [undefined, Infinity]);
	}

	findNearestAliveToPoint(pos: Point): [Maybe<Unpacked<typeof this.creatures>>, number] {
		return this.creatures.reduce<[Maybe<CreatureVictim>, number]>(([minC, minDist], c) => {
			if (!c.alive) return [minC, minDist];
			let dist = pos.getDistToPoint(c.pos);
			if (dist < minDist) {
				return [c, dist];
			}
			return [minC, minDist];
		}, [undefined, Infinity]);
	}

	private getBorderFearVector(pos: Point): Vector {
		// Distance to borders
		const distLeft = pos.x;
		const distRight = this.game.size.width - pos.x;
		const distTop = pos.y;
		const distBottom = this.game.size.height - pos.y;

		// maybe increase BORDER_FEAR_DISTANCE
		const dist2value = (dist: number) => dist < BORDER_FEAR_DISTANCE ? Math.pow(10 / dist - 10 / BORDER_FEAR_DISTANCE, 1) * BORDER_FEAR_FACTOR : 0;

		var forceX = dist2value(distLeft) - dist2value(distRight);
		var forceY = dist2value(distTop) - dist2value(distBottom);
		if (Math.abs(forceX) == Infinity) {
			forceX = Math.sign(forceX);
			forceY = 0;
		} else if (Math.abs(forceY) == Infinity) {
			forceX = 0;
			forceY = Math.sign(forceY);
		}

		return new Vector(forceX, forceY);
	}

	clearDead() {
		if (this.creatures.some(e => Number.isNaN(e.pos.x) || Number.isNaN(e.pos.y))) debugger;
		this.creatures = this.creatures.filter(e => e.alive && e.age < VICTIM_MAX_AGE && !Number.isNaN(e.pos.x) && !Number.isNaN(e.pos.y));
		this.creatures.forEach(e => e.age++);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.color;
		for (let creature of this.creatures) {
			ctx.beginPath();
			ctx.arc(creature.pos.x, creature.pos.y, CREATURE_SIZE, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
	}
}

type CreaturePredator = {
	pos: Point;
	vel: Vector;
	eaten: number;
	hunger: number;
	age: number;
	waiting: number;
	alive: boolean;
};

class PredatorGroup {
	private game: GameLife;
	private color: string;
	private speed: number;
	private reproductionConst: number;
	public creatures: CreaturePredator[];

	constructor(game: GameLife, startX: number, startY: number, color: string, speed: number, reproConst: number) {
		this.game = game;
		this.color = color;
		this.speed = speed;
		this.reproductionConst = reproConst;
		this.creatures = [{
			pos: new Point(startX, startY),
			vel: Vector.random(),
			eaten: 0,
			hunger: 0,
			age: 0,
			waiting: 0,
			alive: true,
		}];
	}
	step(creatures: VictimGroup[]) {
		for (let creature of this.creatures) {
			const [nearestVictim, dist] = creatures.reduce<[Maybe<CreatureVictim>, number]>(([minVictim, minDist], group) => {
				const [victim, dist] = group.findNearestToPoint(creature.pos);
				return dist < minDist ? [victim, dist] : [minVictim, minDist];
			}, [undefined, Infinity]);

			creature.vel = this.calculateVelocity(creature, nearestVictim, dist);
			creature.pos.addVector(creature.vel).limit(0, 0, this.game.size.width - 1, this.game.size.height - 1);

			// Determine final values based on conditions
			if (creature.waiting > 0) {
				creature.waiting--;
			} else if (nearestVictim && dist < EATING_DISTANCE) {
				nearestVictim.alive = false;
				creature.eaten++;
				creature.hunger = Math.max(0.0, creature.hunger - NUTRITION_PER_VICTIM);
			} else {
				creature.hunger += HUNGER_INCREASE_RATE;
			}
		}
	}

	reproduce() {
		var newCreatures = [];
		for (let creature of this.creatures) {
			const creaturesOfThisColor = this.creatures.length;
			if (creaturesOfThisColor + newCreatures.length < MAX_CREATURES_PER_TYPE
				&& creature.eaten >= this.reproductionConst) {
				// Create new predator and reset parent's eaten count
				creature.waiting = PREDATOR_WAITING_AFTER_REPRODUCE;
				newCreatures.push({
					pos: new Point(creature.pos.x + (Math.random() - 0.5) * 10, creature.pos.y + (Math.random() - 0.5) * 10),
					vel: Vector.random(),
					eaten: 0,
					hunger: 0,
					age: 0,
					waiting: PREDATOR_WAITING_AFTER_REPRODUCE,
					alive: true,
				});
				creature.eaten = 0;
			}
		}
		this.creatures = this.creatures.concat(newCreatures);
	}

	private calculateVelocity(creature: CreaturePredator, nearestVictim: Maybe<CreatureVictim>, dist: number) {
		// Check for border avoidance
		const borderFearVector = this.getBorderFearVector(creature.pos);

		const hungerMul = creature.hunger > HUNGER_THRESHOLD ? HUNGRY_SPEED_MULTIPLIER : 1;
		if (creature.waiting > 0) {
			return borderFearVector
				.add(creature.vel)
				.normalize()
				.mul(this.speed * 0.5);
		} else if (nearestVictim && dist <= PREDATOR_DETECTION_RADIUS) {
			return Vector.fromPoints(creature.pos, nearestVictim.pos)
				.normalize()
				.mul(this.speed * CHASE_SPEED_MULTIPLIER * hungerMul);
		} else {
			return borderFearVector
				.add(creature.vel)
				.normalize()
				.mul(this.speed * hungerMul);
		}
	}

	findNearestToPoint(pos: Point): [Maybe<CreaturePredator>, number] {
		return this.creatures.reduce<[Maybe<CreaturePredator>, number]>(([minC, minDist], c) => {
			let dist = pos.getDistToPoint(c.pos);
			if (dist < minDist) {
				return [c, dist];
			}
			return [minC, minDist]
		}, [undefined, Infinity]);
	}

	findNearestAliveToPoint(pos: Point): [Maybe<Unpacked<typeof this.creatures>>, number] {
		return this.creatures.reduce<[Maybe<CreaturePredator>, number]>(([minC, minDist], c) => {
			if (!c.alive) return [minC, minDist];
			let dist = pos.getDistToPoint(c.pos);
			if (dist < minDist) {
				return [c, dist];
			}
			return [minC, minDist];
		}, [undefined, Infinity]);
	}

	private getBorderFearVector(pos: Point): Vector {
		// Distance to borders
		const distLeft = pos.x;
		const distRight = this.game.size.width - pos.x;
		const distTop = pos.y;
		const distBottom = this.game.size.height - pos.y;

		// maybe increase BORDER_FEAR_DISTANCE
		const dist2value = (dist: number) => dist < BORDER_FEAR_DISTANCE ? Math.pow(10 / dist - 10 / BORDER_FEAR_DISTANCE, 2) : 0;

		var forceX = dist2value(distLeft) - dist2value(distRight);
		var forceY = dist2value(distTop) - dist2value(distBottom);
		if (forceX == Infinity) {
			forceX = Math.sign(forceX);
			forceY = 0;
		} else if (forceY == Infinity) {
			forceX = 0;
			forceY = Math.sign(forceY);
		}

		// TODO: use Vector.random not so often, or just fix angle
		return new Vector(forceX, forceY)
			.add((distLeft < 20 || distRight < 20 || distTop < 20 || distBottom < 20) ? Vector.random() : Vector.zero());
	}

	clearDead() {
		this.creatures = this.creatures.filter(e => e.alive && e.hunger < MAX_HUNGER && e.age < VICTIM_MAX_AGE * 500);
		this.creatures.forEach(e => e.age++);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.color;
		for (let creature of this.creatures) {
			ctx.beginPath();
			ctx.arc(creature.pos.x, creature.pos.y, CREATURE_SIZE, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
	}
}

class GameLife {
	size: {
		width: number;
		height: number;
	}
	blue!: VictimGroup;
	green!: VictimGroup;
	yellow!: VictimGroup;
	red!: PredatorGroup;

	constructor(width: number, height: number) {
		this.size = { width, height };
		this.reload();
	}

	public reload() {
		this.blue = new VictimGroup(
			this, 50, 50,
			"blue", 1.5 / 5, BLUE_REPRODUCTION_TIME,
		);
		this.green = new VictimGroup(
			this, this.size.width - 50, 50,
			"green", 2 / 5, GREEN_REPRODUCTION_TIME,
		);
		this.yellow = new VictimGroup(
			this, this.size.width - 50, this.size.height - 50,
			"yellow", 3 / 5, YELLOW_REPRODUCTION_TIME,
		);
		this.red = new PredatorGroup(
			this, 50, this.size.height - 50,
			"red", 4 / 5, 100,
		);
	}

	public step() {
		this.blue.step([this.red]);
		this.green.step([this.red]);
		this.yellow.step([this.red]);
		this.red.step([this.blue, this.green, this.yellow]);
		this.blue.reproduce();
		this.green.reproduce();
		this.yellow.reproduce();
		this.red.reproduce();
		this.blue.clearDead();
		this.green.clearDead();
		this.yellow.clearDead();
		this.red.clearDead();
	}

	public draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		ctx.clearRect(0, 0, this.size.width, this.size.height);
		ctx.fillStyle = BG_COLOR;
		ctx.fillRect(0, 0, this.size.width, this.size.height);
		this.blue.draw(ctx);
		this.green.draw(ctx);
		this.yellow.draw(ctx);
		this.red.draw(ctx);
	}
}

export default GameLife; 