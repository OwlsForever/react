import React, { useEffect, useState } from "react";
import Canvas from "../../components/canvas2";
import Panel from "../../components/panel";
import Button from "../../components/button";
import Input from "../../components/input";
import { getRandomSeed } from "../../src/utils/random";
import { useStateWithURLParams } from "../../src/utils/helpers";
import images from "./images";
import Dialog from "../../components/dialog";
import { CELL_SIZE, Taiji } from "./taiji";

function Page() {
	const [stepsLeft, setStepsLeft] = useState(2);
	const [scale, setScale] = useStateWithURLParams(5, "s");
	const [width, setWidth] = useStateWithURLParams(5, "w");
	const [height, setHeight] = useStateWithURLParams(5, "h");
	const [imageId, setImageId] = useStateWithURLParams(-1, "id", e => +e, e => "" + e);
	const [seed, setSeed] = useStateWithURLParams(imageId > 0 ? -1 : getRandomSeed(), "seed", e => +e, e => "" + e);
	const [showDialog, setShowDialog] = useState(false);
	const [game, _] = useState(new Taiji(width, height, scale, () => setStepsLeft(e => e - 1), seed, imageId));
	useEffect(() => game.setSeed(seed), [seed]);

	const [redraw, callRedraw] = useState(false);

	useEffect(() => {
		if (stepsLeft === 0) {
			game.initGame();
		}
	}, [stepsLeft]);

	const canvasBaseStyle: React.CSSProperties = { position: "absolute", left: 0, top: 0, padding: "8px" };

	return <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
		<Panel fillAvailable cssStyle={{ position: "relative", overflow: "auto", }}		>
			<Canvas
				width={game.width * CELL_SIZE * game.scale}
				height={game.height * CELL_SIZE * game.scale}
				onMount={canvas => game.setCanvasCtx(canvas)}
				cssStyle={{ ...canvasBaseStyle, zIndex: 2 }}
			/>
			<Canvas
				width={game.width * CELL_SIZE * game.scale}
				height={game.height * CELL_SIZE * game.scale}
				onMount={canvas => game.setCanvasBgCtx(canvas)}
				cssStyle={{ ...canvasBaseStyle, zIndex: 1 }}
			/>
		</Panel>
		<div style={{ display: "flex", flexDirection: "column", height: "100%", }}>
			<Panel extraClasses="p8" cssStyle={{ width: "300px", flex: "0 0 auto", height: "100%", }}>
				{stepsLeft > 0 ? <h1>Loading...</h1>
					: <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, auto)", justifyContent: "start", alignItems: "center" }}>
						<h3 className="pb8" style={{ gridColumn: "1 / span 2" }}>Settings</h3>
						<h5 style={{ display: "inline" }}>Width</h5>
						<Input
							value={width}
							onChange={e => setWidth(+e.target.value)}
							cssStyle={{ width: "140px" }}
							otherAttributes={{ type: "number", min: "1" }}
						/>
						<h5 style={{ display: "inline" }}>Height</h5>
						<Input
							value={height}
							onChange={e => setHeight(+e.target.value)}
							cssStyle={{ width: "140px" }}
							otherAttributes={{ type: "number", min: "1" }}
						/>
						<h5 style={{ display: "inline" }}>Scale</h5>
						<Input
							value={scale}
							onChange={e => {
								game.scale = +e.target.value;
								setScale(+e.target.value);
								callRedraw(e => !e);
								setTimeout(() => game.redraw(), 1);
							}}
							cssStyle={{ width: "140px" }}
							otherAttributes={{ type: "number", min: "1", max: "5" }}
						/>
						<h5 style={{ display: "inline" }}>Seed</h5>
						<Input
							value={seed}
							onChange={e => setSeed(+e.target.value)}
							cssStyle={{ width: "140px" }}
							otherAttributes={{ type: "number", min: "0" }}
						/>
						<Button text="New game" color="green" onClick={() => {
							game.setSeed();
							setImageId(-1);
							setSeed(game.seed);
							game.generateGame();
						}} />
						<Button text="Apply changes" onClick={() => {
							game.width = width;
							game.height = height;
							game.scale = scale;
							callRedraw(e => !e);
							game.setSeed(seed);
							setImageId(-1);
							setTimeout(() => game.generateGame(), 1);
						}} />
						<Button text="Check (space)" onClick={() => game.check()} />
						<Dialog
							state={[showDialog, setShowDialog]}
							button={<Button
								text="Choose image"
								onClick={() => setShowDialog(true)}
								cssStyle={{ gridColumn: "1 / span 2" }}
							/>}
							cssStyle={{ width: "50%", height: "50%", overflow: "hidden" }}
						>
							<Panel extraClasses="p8" cssStyle={{ display: "flex", flexDirection: "column", height: "100%", }}>
								<h3 className="pb8">Images</h3>
								<div className="mb8" style={{ overflowY: "auto", display: "flex", flexWrap: "wrap", gap: "8px" }}>
									{images.map((e, i) => <Button
										key={i}
										text={`${e.title} (${e.width}x${e.height})`}
										onClick={() => {
											setWidth(e.width);
											setHeight(e.height);
											setImageId(e.id);
											setSeed(-1);
											game.generateGameFromImage(e);
											setShowDialog(false);
											callRedraw(e => !e);
											setTimeout(() => game.redraw(), 1);
										}}
									/>)}
								</div>
								<Button
									text="Close"
									color="red"
									onClick={() => setShowDialog(false)}
								/>
							</Panel>
						</Dialog>
						<Button color="green" text="Save" onClick={() => game.save()} />
						<Button color="red" text="Load" onClick={() => game.load((width: number, height: number, scale: number, seed: number, imageId: number) => {
							setWidth(width);
							setHeight(height);
							setScale(scale);
							setSeed(seed);
							setImageId(imageId);
						})} />
					</div>}
			</Panel>
		</div>
	</div>
}

export default Page;
