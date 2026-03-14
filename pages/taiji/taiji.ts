import { idfn } from "../../src/utils/helpers";
import { getMulberry32PRNG, getRandomSeed } from "../../src/utils/random";
import images, { Image } from "./images";
import Nonogram from "./nonograms";

export const CELL_SIZE = 16;

enum PLACING {
	NONE,
	ON,
	OFF,
	MARK_ON,
	MARK_OFF,
}

export class Taiji {
	// field params
	width: number;
	height: number;
	scale: number;

	// drawing
	decrementStepsLeft: () => void;
	private canvas!: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;
	private canvasBg!: HTMLCanvasElement;
	private ctxBg!: CanvasRenderingContext2D;
	private colorPalette = {
		flowerYellow: "#ffc22a",
		flowerPurple: "#cb27ff",
		cellDark: "#271f23",
		cellLight: "#8f8e93",
		cellMark: "#ffffff",
		cellDoneDark: "#2d272b",
		cellDoneLight: "#e4e4ed",
	}

	// user input
	private answer: boolean[][] = [];
	private input: { checked: boolean, marked: boolean }[][] = [];
	private rules: Maybe<number>[][] = [];
	private isComplete: boolean = false;
	private state: PLACING = PLACING.NONE;


	// field infos
	private random!: () => number;
	seed: number = -1;
	imageId: number = -1;

	constructor(width: number, height: number, scale: number, decrementStepsLeft: () => void, seed: number = -1, imageId: number = -1) {
		this.width = width;
		this.height = height;
		this.scale = scale;
		this.decrementStepsLeft = decrementStepsLeft;
		this.setSeed(seed);
		this.imageId = imageId;
	}

	public updateSizes(width: number, height: number, scale: number) {
		this.width = width;
		this.height = height;
		this.scale = scale;
	}

	public setSeed(seed: number = getRandomSeed()) {
		this.seed = seed;
		if (seed > -1) this.imageId = -1;
		this.random = getMulberry32PRNG(this.seed);
	}

	public setCanvasCtx(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.decrementStepsLeft();
	}

	public setCanvasBgCtx(canvas: HTMLCanvasElement) {
		this.canvasBg = canvas;
		this.ctxBg = canvas.getContext("2d")!;
		this.decrementStepsLeft();
	}

	initGame() {
		const updateCell = (e: MouseEvent) => {
			if (this.state == PLACING.NONE) return;
			const [i, j] = this.xy2ij(e.offsetX, e.offsetY);
			switch (this.state) {
				case PLACING.ON: this.input[i][j].checked = true; break;
				case PLACING.OFF: this.input[i][j].checked = false; break;
				case PLACING.MARK_ON: this.input[i][j].marked = true; break;
				case PLACING.MARK_OFF: this.input[i][j].marked = false; break;
			}
			this.drawCell(i, j);
		}
		this.canvas.addEventListener("mousedown", e => {
			const [i, j] = this.xy2ij(e.offsetX, e.offsetY);
			if (e.button == 0) {
				this.state = this.input[i][j].checked ? PLACING.OFF : PLACING.ON;
			} else if (e.button == 1) {
				this.state = this.input[i][j].marked ? PLACING.MARK_OFF : PLACING.MARK_ON;
			} else if (e.button == 2) {
				this.state = this.input[i][j].marked ? PLACING.MARK_OFF : PLACING.MARK_ON;
			}
			updateCell(e);
		});
		this.canvas.addEventListener("mouseup", e => {
			this.state = PLACING.NONE;
		});
		this.canvas.addEventListener("mousemove", updateCell);
		document.addEventListener("keydown", e => {
			if (e.code == "Space") {
				alert(this.check() ? "Done" : "Something wrong");
			}
		});
		document.addEventListener("contextmenu", (e: MouseEvent) => e.preventDefault());
		const imageM = images.find(img => img.id == this.imageId);
		if (imageM) this.generateGameFromImage(imageM); else this.generateGame();
	}

	generateGame() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.scale(this.scale, this.scale);
		this.ctxBg.setTransform(1, 0, 0, 1, 0, 0);
		this.ctxBg.scale(this.scale, this.scale);
		// reset random
		this.setSeed(this.seed);
		this.isComplete = false;
		this.answer = [];
		this.input = [];
		this.rules = [];
		for (let i = 0; i < this.height; i++) {
			this.answer[i] = [];
			this.input[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.answer[i][j] = this.random() > 0.5;
				this.input[i][j] = { checked: false, marked: false };
				this.drawCell(i, j);
			}
		}
		for (let i = 0; i < this.height; i++) {
			this.rules[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.rules[i][j] = this.random() > 0.2 ? this.getCount(this.answer, i, j, idfn) : undefined;
				this.drawFlower(i, j, this.rules[i][j]);
			}
		}
	}

	generateGameFromNonogram(nonogram: Nonogram) {
		this.isComplete = false;
		this.width = nonogram.width;
		this.height = nonogram.height;
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.scale(this.scale, this.scale);
		this.ctxBg.setTransform(1, 0, 0, 1, 0, 0);
		this.ctxBg.scale(this.scale, this.scale);
		this.answer = nonogram.getField().map(e => e.map(e => e === true ? true : false));;
		this.input = [];
		this.rules = [];
		for (let i = 0; i < this.height; i++) {
			this.input[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.input[i][j] = { checked: false, marked: false };
				this.drawCell(i, j);
			}
		}
		for (let i = 0; i < this.height; i++) {
			this.rules[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.rules[i][j] = this.getCount(this.answer, i, j, idfn);
				this.drawFlower(i, j, this.rules[i][j]);
			}
		}
	}

	generateGameFromImage(image: Image) {
		this.imageId = image.id;
		this.isComplete = false;
		this.width = image.width;
		this.height = image.height;
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.scale(this.scale, this.scale);
		this.ctxBg.setTransform(1, 0, 0, 1, 0, 0);
		this.ctxBg.scale(this.scale, this.scale);
		this.answer = image.field.map(e => {
			let res = [];
			for (let i = 0; i < e.length; i++) {
				let num = e[i];
				const size = Math.min(image.width - i * 32, 31);
				for (let i = 0; i < size; i++) {
					res.push((num & (1 << (size - i))) !== 0);
				}
			}
			return res;
		});
		this.input = [];
		this.rules = [];
		for (let i = 0; i < this.height; i++) {
			this.input[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.input[i][j] = { checked: false, marked: false };
				this.drawCell(i, j);
			}
		}
		for (let i = 0; i < this.height; i++) {
			this.rules[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.rules[i][j] = this.getCount(this.answer, i, j, idfn);
				this.drawFlower(i, j, this.rules[i][j]);
			}
		}
	}

	redraw() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.scale(this.scale, this.scale);
		this.ctxBg.setTransform(1, 0, 0, 1, 0, 0);
		this.ctxBg.scale(this.scale, this.scale);
		this.ctx.clearRect(0, 0, this.width * CELL_SIZE, this.height * CELL_SIZE);
		this.ctxBg.clearRect(0, 0, this.width * CELL_SIZE, this.height * CELL_SIZE);
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.drawCell(i, j);
			}
		}
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.drawFlower(i, j, this.rules[i][j]);
			}
		}
	}

	check() {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (this.rules[i][j]) {
					if (this.getCount(this.input, i, j, e => e?.checked) !== this.rules[i][j]) return false;
				}
			}
		}
		this.isComplete = true;
		this.redraw();
		return true;
	}

	getCount<T>(a: T[][], i: number, j: number, v2b: (e: Maybe<T>) => Maybe<boolean>) {
		return (v2b(a[i - 1]?.[j]) === v2b(a[i][j]) ? 1 : 0) +
			(v2b(a[i + 1]?.[j]) === v2b(a[i][j]) ? 1 : 0) +
			(v2b(a[i]?.[j - 1]) === v2b(a[i][j]) ? 1 : 0) +
			(v2b(a[i]?.[j + 1]) === v2b(a[i][j]) ? 1 : 0);
	}

	private drawFlower(i: number, j: number, flower?: number) {
		const [x, y] = this.ij2xy(i, j);
		if (flower !== undefined && !this.isComplete) {
			const getColor = (num: number) => flower > num ? this.colorPalette.flowerYellow : this.colorPalette.flowerPurple;
			const removePixel = (dx: number, dy: number) => this.ctx.clearRect(x + dx, y + dy, 1, 1);
			this.ctx.fillStyle = getColor(0);
			this.ctx.fillRect(x + 4, y + 4, 3, 4);
			removePixel(4, 4);
			removePixel(6, 6);
			removePixel(4, 7);
			this.ctx.fillStyle = getColor(1);
			this.ctx.fillRect(x + 4, y + 9, 4, 3);
			removePixel(6, 9);
			removePixel(4, 11);
			removePixel(7, 11);
			this.ctx.fillStyle = getColor(2);
			this.ctx.fillRect(x + 9, y + 8, 3, 4);
			removePixel(11, 8);
			removePixel(9, 9);
			removePixel(11, 11);
			this.ctx.fillStyle = getColor(3);
			this.ctx.fillRect(x + 8, y + 4, 4, 3);
			removePixel(8, 4);
			removePixel(11, 4);
			removePixel(9, 6);
		} else {
			this.ctx.clearRect(x, y, CELL_SIZE, CELL_SIZE);
		}
	}

	private drawCell(i: number, j: number) {
		const [x, y] = this.ij2xy(i, j);
		this.fillRect(this.ctxBg, x, y, 0, this.colorPalette[this.isComplete ? "cellDoneDark" : "cellDark"]);
		this.strokeRect(this.ctxBg, x, y, 1, this.colorPalette[this.isComplete ? "cellDoneLight" : this.input[i][j].marked ? "cellMark" : "cellLight"]);
		if (this.input[i][j].checked) {
			this.fillRect(this.ctxBg, x, y, 3, this.colorPalette[this.isComplete ? "cellDoneLight" : "cellLight"]);
		}
	}

	private strokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, sizeMod: number, color: string) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.strokeRect(x + sizeMod + 0.5, y + sizeMod + 0.5, 15 - sizeMod * 2, 15 - sizeMod * 2);
	}

	private fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, sizeMod: number, color: string) {
		ctx.fillStyle = color;
		ctx.fillRect(x + sizeMod, y + sizeMod, CELL_SIZE - sizeMod * 2, CELL_SIZE - sizeMod * 2);
	}

	private ij2xy(i: number, j: number) {
		return [j * CELL_SIZE, i * CELL_SIZE];
	}
	private xy2ij(x: number, y: number) {
		return [Math.floor(y / CELL_SIZE / this.scale), Math.floor(x / CELL_SIZE / this.scale)];
	}

	public save() {
		localStorage.setItem("taiji", JSON.stringify({ width: this.width, height: this.height, scale: this.scale, seed: this.seed, imageId: this.imageId, input: this.input }))
	}
	public load(onLoad: (width: number, height: number, scale: number, seed: number, imageId: number) => void) {
		const saveRaw = localStorage.getItem("taiji");
		if (saveRaw) {
			const save = JSON.parse(saveRaw);
			this.width = save.width;
			this.height = save.height;
			this.scale = save.scale;
			this.seed = save.seed;
			this.imageId = save.imageId;
			const imageM = images.find(img => img.id == this.imageId);
			if (imageM) this.generateGameFromImage(imageM); else this.generateGame();
			this.input = save.input;
			onLoad(this.width, this.height, this.scale, this.seed, this.imageId);
			setTimeout(() => this.redraw(), 1);
		}
	}
}
