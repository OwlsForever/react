import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();

let simpleLogger = (req: Request, res: Response, next: () => void) => {
	let formattedDate = (new Date()).toLocaleString();
	console.log(`[${formattedDate}] ${res.statusCode} ${req.method} ${req.url}`);
	next();
};
app.use(simpleLogger);

// Middleware
app.use(express.static(__dirname + "/static"));
app.use("/public", express.static(path.join(__dirname, "static", "public")))

//#region Routes
app.get("/", async (_req, res) => res.sendFile(path.resolve(__dirname, "static", "views", "pages", "index.html")));
const pages = ["repo", "dreamRaiders"];
pages.forEach(pageName => app.get("/" + pageName, async (_req, res) => res.sendFile(path.resolve(__dirname, "static", "views", "pages", pageName + ".html"))));
//#endregion

const configs = new Map(fs.readFileSync("server.config", "utf8").split("\n").map(e => e.split("=") as [string, string]));
const port = configs.get("port");

app.listen(port, () => {
	console.info(`Running on ${port}`)
});
