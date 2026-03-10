import express from "express";
import path from "path";
import fs from "fs";
import { init } from "./utils";

const app = express();

init(app);

//#region Routes
app.get("/", async (_req, res) => res.sendFile(path.resolve(__dirname, "..", "static", "views", "pages", "index.html")));
const pages = ["repo", "dreamRaiders", "ranobe", "simulations"];
pages.forEach(pageName => app.get("/" + pageName, async (_req, res) => res.sendFile(path.resolve(__dirname, "..", "static", "views", "pages", pageName + ".html"))));
//#endregion

const configs = new Map(fs.readFileSync(path.resolve(__dirname, "server.config"), "utf8").split("\n").map(e => e.split("=") as [string, string]));
const port = configs.get("port");

app.listen(port, () => {
	console.info(`Running on ${port}`)
});
