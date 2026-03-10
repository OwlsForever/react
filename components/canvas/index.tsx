import React, { useEffect, useRef } from "react";
import { BasePropsNoChildren } from "../../src/types/base";
import { makeClassName } from "../../src/utils/helpers";

import "./style.scss";

type Props = {
	width: number;
	height: number;
	needBG?: boolean;
	paused?: boolean;
	forCanvas: {
		[key: string]: any;
		step: () => void;
		draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
		drawBG?: (ctx: CanvasRenderingContext2D) => void;
		onMouseMove?: (e: MouseEvent) => void;
	}
}

function Canvas(props: BasePropsNoChildren<Props>) {
	const {
		width, height, needBG, paused, forCanvas,
		extraClasses
	} = props;

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasBGRef = useRef<HTMLCanvasElement>(null);
	var canvas: HTMLCanvasElement | null = null;
	var ctx: CanvasRenderingContext2D | null = null;
	var ctxBG: CanvasRenderingContext2D | null = null;

	var pause = false;
	var exists = true;
	const tick = () => {
		if (!paused && canvas && ctx) {
			forCanvas.step();
			forCanvas.draw(ctx, canvas);
			if (ctxBG) { forCanvas.drawBG!(ctxBG); }
		}
		if (exists) requestAnimationFrame(tick);
	}

	useEffect(() => { return () => { exists = false; } });

	useEffect(() => {
		if (canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext("2d");
			if (forCanvas.onMouseMove) {
				canvas.addEventListener("mousemove", forCanvas.onMouseMove);
			}
		}
		let canvasBG = canvasBGRef.current;
		if (needBG && canvasBG) {
			ctxBG = canvasBG.getContext("2d");
			if (ctxBG) { forCanvas.drawBG!(ctxBG); }
		}
		if (canvasRef.current && (!needBG || canvasBG)) tick();
	}, [canvasRef, canvasBGRef]);

	return <div className={makeClassName([
		"canvas-component",
		extraClasses,
	])}>
		<canvas
			className="main"
			onClick={(e) => { if (e.shiftKey) pause = !pause }}
			ref={canvasRef}
			width={width + "px"}
			height={height + "px"}
		/>
		{needBG ? <canvas
			className="background"
			onClick={(e) => { if (e.shiftKey) pause = !pause }}
			ref={canvasBGRef}
			width={width + "px"}
			height={height + "px"}
		/> : ""}
	</div>
}
export default Canvas;
