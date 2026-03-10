import React from "react";
import Canvas from "../../components/canvas";
import GameLife from "./simulationClasses/gameLife";
import Panel from "../../components/panel";

function Page() {
	const game = new GameLife(1500, 1000);

	return <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
		<div style={{ display: "flex", flex: 1 }}>
			<Panel extraClasses="p8" fillAvailable>
				<Canvas
					width={game.size.width}
					height={game.size.height}
					forCanvas={game}
				/>
			</Panel>
		</div>
	</div>
}

export default Page;
