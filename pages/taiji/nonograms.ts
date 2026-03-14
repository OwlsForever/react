export default class Nonogram {
	readonly title: string;
	width: number;
	height: number;
	private url: string;
	private cols: number[][];
	private rows: number[][];
	private field: Maybe<boolean>[][];
	private colsDone: boolean[];
	private rowsDone: boolean[];
	isSolved: Maybe<boolean>;

	constructor(title: string, width: number, height: number, url: string, cols: number[][], rows: number[][]) {
		this.title = title;
		this.width = width;
		this.height = height;
		this.url = url;
		this.cols = cols;
		this.rows = rows;
		this.field = new Array(height).fill(0).map(_ => new Array(width).fill(undefined));
		this.colsDone = new Array(width).fill(false);
		this.rowsDone = new Array(height).fill(false);
	}

	public solve() {
		var counter = 0;
		while (!this.colsDone.every(e => e) && !this.rowsDone.every(e => e)) {
			let changed = false;
			changed ||= this.tryAllPositions(counter);
			if (!changed) changed ||= this.tryAllPositions(counter, true);
			counter++;
			if (!changed) {
				this.isSolved = false;
				return false;
			}
		}
		this.isSolved = true;
		return true;
	}

	private tryAllPositions(counter: number, isBruteforce: boolean = false) {
		let returnVal = false;
		let changedRow = false;
		for (let i = 0; i < this.height; i++) {
			if (!this.rowsDone[i]) {
				if (this.tryPositionsForRow(i, isBruteforce || counter == 0 && i == 0)) {
					changedRow = true;
					this.rowsDone[i] = this.field[i].every(e => e !== undefined);
				}
				if (this.rowsDone[i] !== this.field[i].every(e => e !== undefined)) console.log("\nWrong Row " + counter);
			}
		}
		if (changedRow) {
			for (let j = 0; j < this.width; j++) {
				if (!this.colsDone[j]) this.colsDone[j] = this.field.every(e => e[j] !== undefined);
			}
		}
		let changedCol = false;
		for (let j = 0; j < this.width; j++) {
			if (!this.colsDone[j]) {
				if (this.tryPositionsForCol(j, isBruteforce)) {
					changedCol = true;
					this.colsDone[j] = this.field.every(e => e[j] !== undefined);
				}
				if (this.colsDone[j] !== this.field.every(e => e[j] !== undefined)) console.log("\nWrong Col " + counter);
			}
		}
		returnVal ||= changedCol;
		if (changedCol) {
			for (let i = 0; i < this.height; i++) {
				if (!this.rowsDone[i]) this.rowsDone[i] = this.field[i].every(e => e !== undefined);
			}
		}
		return changedRow || changedCol;
	}

	private tryPositionsForRow(i: number, isBruteforce: boolean = false) {
		const hints = this.rows[i];
		if (hints.length == 0) {
			for (let j = 0; j < this.width; j++)
				this.field[i][j] = false;
			return true;
		} else {
			const newField = this.tryPositions([...this.field[i]], hints);
			let changed = newField.join(",") != this.field[i].join(",");
			if (changed) this.field[i] = newField;
			return changed;
		}
	}

	private tryPositionsForCol(j: number, isBruteforce: boolean = false) {
		const hints = this.cols[j];
		if (hints.length == 0) {
			for (let i = 0; i < this.height; i++) {
				this.field[i][j] = false;
			}
			return true;
		} else {
			var oldField = [];
			for (let i = 0; i < this.height; i++) {
				oldField[i] = this.field[i][j];
			}
			const newField = this.tryPositions([...oldField], hints);
			let changed = newField.join(",") != oldField.join(",");
			if (changed) {
				for (let i = 0; i < this.height; i++) {
					this.field[i][j] = newField[i];
				}
			}
			return changed;
		}
	}

	private tryPositions(field: Maybe<boolean>[], hints: number[]) {
		// basic intersections
		var fieldLeft: number[] = [];
		var fieldRight: number[] = [];
		this.placeFilledRecursion(field, hints, fieldLeft);
		this.placeFilledRecursion([...field].reverse(), [...hints].reverse(), fieldRight);
		fieldRight = fieldRight.reverse().map((e, i) => field.length - e - hints[i]);
		for (let i = 0; i < fieldLeft.length; i++) {
			if (fieldLeft[i] + hints[i] > fieldRight[i]) {
				for (let j = fieldRight[i]; j < fieldLeft[i] + hints[i]; j++) {
					field[j] = true;
				}
			}
		}
		if (fieldLeft.length !== fieldRight.length || fieldLeft.length !== hints.length) {
			alert("Something went wrong");
			console.log(this.title);
			console.log(this.url);
			debugger;
		}
		// advanced intersections
		let fromEmpty = -1;
		let fromFilled = -1;
		let toFilled = -1;
		let toEmpty = -1;
		let results: { fromEmpty: number, fromFilled: number, toFilled: number, toEmpty: number }[] = [];
		for (let i = 0; i <= field.length; i++) {
			if (field[i] === true) {
				if (fromFilled == -1) {
					fromFilled = i;
				}
				toFilled = i;
			} else if (field[i] === false || i == field.length) {
				toEmpty = i;
				if (fromFilled > -1) {
					// ignore if filled part can't be expanded
					if (fromEmpty + 1 < fromFilled || toFilled + 1 < toEmpty) results.push({ fromEmpty, fromFilled, toFilled, toEmpty });
				}
				fromEmpty = i;
				fromFilled = -1;
				toFilled = -1;
			}
		}
		results.forEach(({ fromEmpty, fromFilled, toFilled, toEmpty }) => {
			const minSize = toFilled - fromFilled + 1;
			const maxSize = toEmpty - fromEmpty - 1;
			let maxFrom = undefined;
			let minTo = undefined;
			for (let i = 0; i < hints.length; i++) {
				if (
					hints[i] >= minSize && hints[i] <= maxSize
					&& fieldLeft[i] <= fromFilled && fieldRight[i] + hints[i] - 1 >= toFilled
				) {
					const maxFromCurrent = toEmpty - hints[i];
					if (maxFrom === undefined || maxFrom < maxFromCurrent) maxFrom = maxFromCurrent;
					const minToCurrent = fromEmpty + hints[i];
					if (minTo === undefined || minTo > minToCurrent) minTo = minToCurrent;
				}
			}
			for (let i = maxFrom ?? Infinity; i < fromFilled; i++) {
				field[i] = true;
			}
			for (let i = toFilled + 1; i <= (minTo ?? -1); i++) {
				field[i] = true;
			}
		});
		// check empty
		var fieldEmpty = new Set(new Array(field.length).fill(0).map((_e, i) => i).filter(i => field[i] === undefined));
		for (let i = 0; i < fieldLeft[0]; i++) {
			if (field[i] === undefined) {
				field[i] = false;
				fieldEmpty.delete(i);
			}
		}
		for (let i = fieldRight.at(-1)! + hints.at(-1)!; i < field.length; i++) {
			if (field[i] === undefined) {
				field[i] = false;
				fieldEmpty.delete(i);
			}
		}
		for (let posI = 0; posI < fieldLeft.length; posI++) {
			const left = fieldLeft[posI];
			const right = fieldRight[posI];
			const hint = hints[posI];
			const emptyMin = fieldEmpty.keys().next().value ?? Infinity;
			for (let i = Math.max(left, emptyMin); i < left + hint; i++) {
				fieldEmpty.delete(i);
			}
			var fitSet: Set<number> = new Set();
			for (let i = Math.max(left, emptyMin - hint) + 1; i <= right; i++) {
				var isFit = field[i - 1] !== true && field[i + hint] !== true;
				for (let j = 0; j < hint && isFit; j++) {
					isFit = field[i + j] !== false;
				}
				if (isFit) fitSet.add(i);
			}
			if (fitSet.size > 0) {
				const fit = [...fitSet.keys()];
				let from = fit[0];
				let to = from + hint - 1;
				let toRemove: { from: number, to: number }[] = [];

				const limit = fit[fit.length - 1]
				for (let i = from; i <= limit; i++) {
					if (fitSet.has(i)) {
						if (to + 1 < i) {
							toRemove.push({ from, to });
							from = i;
						}
						to = i + hint - 1;
					}
				}
				toRemove.push({ from, to });
				toRemove.forEach(({ from, to }) => {
					for (let i = from; i <= to; i++) fieldEmpty.delete(i);
				});
			}
		}
		fieldEmpty.forEach(i => field[i] = false);
		return field;
	}

	private placeFilledRecursion(
		field: Maybe<boolean>[],
		hints: number[],
		result: number[] = [],
		currentPos: number = 0,
		movementLeft: number = hints.reduce((res, e) => res + e, hints.length - 1)
	) {
		if (hints.length == 0) {
			for (let i = currentPos; i < field.length; i++) {
				if (field[i] === true) return false;
			}
			return true;
		}
		const hint = hints[0];
		const otherHints = hints.slice(1);
		var limit = field.length - movementLeft;
		for (let i = currentPos; i <= limit; i++) {
			if (field[i] === true) limit = i;
			var isFit = field[i + hint] !== true;
			for (let j = 0; j < hint && isFit; j++) {
				isFit = field[i + j] !== false;
			}
			if (isFit) {
				result.push(i);
				let res = this.placeFilledRecursion(field, otherHints, result, i + hint + 1, movementLeft - hint - 1);
				if (res) return true;
				result.pop();
			}
		}
		return false;
	}

	private field2s(field: Maybe<boolean>[], test: boolean = false) {
		return field.map((e, i) => (e === undefined ? "." : e ? "#" : "x") + (test && i % 5 == 4 && i < field.length - 1 ? "|" : "")).join("")
	}
	public print() {
		console.log(this.title);
		console.log(this.url);
		console.log(this.field.map(e => e.map(e => e ? "#" : ".").join("")).join("\n"));
	}
	public print2() {
		let line = new Array(Math.floor(this.width * 1.2 - 1)).fill("-").join("");
		var output = this.field
			.map(e => this.field2s(e, true))
			.reduce((res: string[], e, i) => {
				res.push(e);
				if (i % 5 == 4 && i < this.height - 1) res.push(line);
				return res;
			}, []).join("\n");
		console.log(output);
	}
	public getField() {
		return this.field;
	}

	public getProcessed() {
		return {
			id: +this.url.split("/").at(-1)!,
			title: this.title,
			width: this.width,
			height: this.height,
			url: this.url,
			cols: this.cols,
			rows: this.rows,
			field: this.field.map(row => {
				var current = 0;
				var res = [];
				for (let i = 0; i < this.width; i++) {
					if (row[i]) current |= 1;
					if (i % 32 == 31) {
						res.push(current);
						current = 0;
					} else current <<= 1;
				}
				res.push(current);
				return res;
			})
		}
	}
}
