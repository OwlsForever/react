import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { init } from "./utils";

const app = express();

init(app);

//#region Routes
app.get("/", async (_req, res) => res.sendFile(path.resolve(__dirname, "..", "static", "views", "pages", "index.html")));
const pages = ["repo", "dreamRaiders", "ranobe", "simulations", "taiji"];
pages.forEach(pageName => app.get("/" + pageName, async (_req, res) => res.sendFile(path.resolve(__dirname, "..", "static", "views", "pages", pageName + ".html"))));
//#endregion

//#region API
const enableNonogramSaving = false;
if (enableNonogramSaving) {
	type Nonogram = { title: string, width: number, height: number, url: string, cols: number[][], rows: number[][] };
	var nonograms: Nonogram[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, "nonograms.json"), "utf8"));
	// used to download from external sites with tampermonkey script
	const corsOptions = {
		origin: "https://www.nonograms.org",
		methods: ["POST"],
		allowedHeaders: ["Content-Type", "Authorization"]
	};
	app.post("/saveNonogram", cors(corsOptions), async (req, res) => {
		// console.info("OWL");
		// console.info("req.body");
		// console.info(typeof req.body);
		const info = req.body as Nonogram;
		const exists = nonograms.some(e => e.url == info.url);
		if (!exists) nonograms.push(info);
		fs.writeFileSync(path.resolve(__dirname, "nonograms.json"), JSON.stringify(nonograms.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0)));
		console.log(`Nonogram "${info.title}" ${exists ? "exists" : "saved"}`);
		res.json({});
	});
	app.options("/saveNonogram", cors(corsOptions));
}
app.use("/api", getApiRoutes(db));
//#endregion

const configs = new Map(fs.readFileSync(path.resolve(__dirname, "server.config"), "utf8").split("\n").map(e => e.split("=") as [string, string]));
const port = configs.get("port");

app.listen(port, () => {
	console.info(`Running on ${port}`)
});
