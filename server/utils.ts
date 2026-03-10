import express, { Request, Response, Express } from "express";
import path from "path";
import fs from "fs";

export const logError = (err: Error, customMessage?: string) => {
	console.log("Something went wrong, check node.error.log");
	console.log(err.stack);
	fs.writeFileSync(
		path.resolve(__dirname, "logs", "node.error.log"),
		`Timestamp: ${(new Date()).toLocaleString()}\n` +
		`Caught exception: ${err}\n` +
		`Stack: ${err.stack}\n` +
		(customMessage ? customMessage : "") +
		`-------\n`,
		{ flag: 'a' }
	);
}

export const init = (app: Express) => {
	//#region Middleware
	// just console logger
	let simpleLogger = (req: Request, res: Response, next: () => void) => {
		let formattedDate = (new Date()).toLocaleString();
		console.log(`[${formattedDate}] ${res.statusCode} ${req.method} ${req.url}`);
		next();
	};
	app.use(simpleLogger);

	// save errors
	process.on('uncaughtException', (err, origin) => {
		logError(
			err,
			`Exception origin: ${origin}`
		);
	});

	// body parses
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// static files
	app.use(express.static(path.resolve(__dirname, "..", "static")));
	app.use("/public", express.static(path.join(__dirname, "..", "static", "public")))
	//#endregion
}
