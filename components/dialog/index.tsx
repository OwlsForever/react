import React, { ReactElement, useLayoutEffect, useRef } from "react";
import { BaseProps } from "../../src/types/base";
import { makeClassName } from "../../src/utils/helpers";

import "./style.scss";

interface Props {
	button: ReactElement;
	state: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}

function Dialog(props: BaseProps<Props>) {
	const {
		button,
		state,
		children, extraClasses, cssStyle,
	} = props;

	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = state;
	useLayoutEffect(() => {
		const dialogNode = dialogRef.current;
		if (!dialogNode) return;

		if (isOpen) {
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
	</>
}

export default Dialog;
