import React, { ComponentProps, ReactElement, ReactNode, useLayoutEffect, useRef, useState } from "react";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/helpers";
import Panel from "../panel";
import Button from "../button";

import "./style.scss";

interface Props {
	button: ReactElement;
	// buttonProps: ComponentProps<typeof Button>;
	// enabled: boolean;
	state: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
	close?: () => void;
	color?: "lighter" | "darker";
	shadowType?: "inset" | "inset small";
	fillAvailable?: boolean;
	panelStyle?: React.CSSProperties;
}

function Dialog(props: BaseProps<Props>) {
	const {
		button,
		// buttonProps,
		// enabled,
		close,
		state,
		color, shadowType, fillAvailable, panelStyle,
		children, extraClasses, cssStyle,
	} = props;
	// buttonCustom.props.onClick

	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = state;
	useLayoutEffect(() => {
		const dialogNode = dialogRef.current;
		if (!dialogNode) return;

		if (isOpen) {
			// Use showModal() for a modal dialog (with backdrop)
			dialogNode.showModal();
		} else {
			dialogNode.close();
		}
	}, [isOpen]);

	return <>
		{button}
		<dialog
			className={makeClassName(["dialog-component", extraClasses])}
			ref={dialogRef}
			onCancel={(e) => {
				e.preventDefault();
				setIsOpen(false);
			}}
			style={cssStyle}
		>
			{children}
		</dialog>
		{/* {enabled ? <div
			className={makeClassName(["popup-component", extraClasses])}
			// style is here to prevent margin collapsing for parent/child
			// style={{ display: "flow-root", ...cssStyle }}
			style={cssStyle}
			onClick={close}
		>
			<Panel
				color={color}
				shadowType={shadowType}
				fillAvailable={fillAvailable}
				cssStyle={panelStyle}
			>{children}</Panel>
		</div> : <></>} */}
	</>
}

export default Dialog;
